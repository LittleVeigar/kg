import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TTFLoader } from 'three/examples/jsm/loaders/TTFLoader.js';
import { Font } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';


export default class threeScene {
    scene = null;
    camera = null;
    renderer = null;
    ambientLight = null;
    provinces = ["河南省21:09鹤壁220千伏衡山站省调发现洛阳220KV志斋站上传MDNS（5353）端口访问告警1条，告警内容：未知设备（196.5.1.203）与未知设备（224.0.0.251）之间存在mDNS（5353）端口访问", "上海市21:09鹤壁220千伏衡山站", "湖南省21:09鹤壁220千伏衡山站", "青海省", "湖北省", "江西省", "新疆省", "西藏"];
    constructor() {
        this.init()
    }
    init() {
        this.scene = new THREE.Scene();
        this.setCamera();
        this.setRenderer();
        this.skyBox();
        this.initOrbit();
        this.setLight();
        this.initFlyLines();
        this.loadModel();
        this.animate();
        this.addFont()
    }
    calcIntersect(event) {
        //通过鼠标点击的位置计算出raycaster所需要的点的位置，以屏幕中心为原点，值的范围为-1到1.
        let x = (event.clientX / window.innerWidth) * 2 - 1;
        let y = -(event.clientY / window.innerHeight) * 2 + 1;
        // 通过鼠标点的位置和当前相机的矩阵计算出raycaster
        this.raycaster.setFromCamera(new Three.Vector2(x, y), this.camera);
        let objects = [
            this.preButton,
            this.nextButton,
            this.regionSelector,
            ...this.platformArray,
        ].filter((val) => Boolean(val));
        let intersects = this.raycaster.intersectObjects(objects, true);
        return intersects.length ? intersects[0] : null;
    }

    onMouseClick(event) {
        let intersect = this.calcIntersect(event);
        if (intersect) {
            if (intersect.object.name == "preButton") {
                this.slideRegionSelector(-1);
            }
            if (intersect.object.name == "nextButton") {
                this.slideRegionSelector(1);
            }
            if (intersect.object.name == "regionSelector") {
                let uv = intersect.uv;
                let offsetFac = Math.floor(uv.x / 0.2) - 2;
                this.slideRegionSelector(offsetFac);
            }
            if (intersect.object.parent.name == "platformBall") {
                let platformGroup = intersect.object.parent.parent;
                let platformLabel = platformGroup.getObjectByName("label");
                this.handleLabelVisibilityChange(platformLabel);
            }
        }
    }

    onMouseMove(event) {
        let intersect = this.calcIntersect(event);
        //设置鼠标cursor样式
        if (
            intersect &&
            (intersect.object.name == "preButton" ||
                intersect.object.name == "nextButton" ||
                intersect.object.name == "regionSelector" ||
                intersect.object.parent.name == "platformBall")
        ) {
            this.isCursorPointer = true;
        } else {
            this.isCursorPointer = false;
        }
        if (intersect && intersect.object.parent.name == "platformBall") {
            if (this.hoverPlatform) {
                this.hoverPlatform.object.rotation.y = this.hoverPlatform.rotationY;
            }
            let platformGroup = intersect.object.parent.parent;
            let platform = platformGroup.getObjectByName("platform");
            this.hoverPlatform = {
                object: platform,
                rotationY: platform.rotation.y,
            };
            platform.rotation.y = -Math.PI / 2;
        } else {
            if (this.hoverPlatform) {
                this.hoverPlatform.object.rotation.y = this.hoverPlatform.rotationY;
                this.hoverPlatform = null;
            }
        }
    }
    mount() {
        this.createAreaCone(this.scene)


        // window.addEventListener("click", this.onMouseClick);
        // window.addEventListener("mousemove", this.onMouseMove);
    }
    setCamera() {
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            100000
        );
        this.camera.position.z = 2000;
    }

    initOrbit() {
        this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
    }
    createText(font) {

        let text = '知识图谱智能推荐';
        const height = 60,
            size = 70,
            hover = 30,
            curveSegments = 4,
            bevelThickness = 2,
            bevelSize = 1.5;

        let textGeo = new TextGeometry(text, {
            font: font,
            size: size,
            height: height,
            curveSegments: curveSegments,
            bevelThickness: bevelThickness,
            bevelSize: bevelSize,
            bevelEnabled: true
        });

        textGeo.computeBoundingBox();
        textGeo.computeVertexNormals();

        const centerOffset = -0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x);
        let material = new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: false });
        let textMesh1 = new THREE.Mesh(textGeo, material);

        textMesh1.position.x = centerOffset;
        textMesh1.position.y = hover;
        textMesh1.position.z = 0;

        textMesh1.rotation.x = 0;
        textMesh1.rotation.y = Math.PI * 2;

        this.scene.add(textMesh1)
            // group.add(textMesh1);

    }
    addFont() {
        const loader = new TTFLoader();
        const _this = this;
        loader.load('/songti.ttf', function(json) {
            let font = new Font(json);
            _this.createText(font);
        });
    }
    skyBox() {
        const loader = new THREE.TextureLoader();
        const bgTexture = loader.load('/earth1.png');

        bgTexture.wrapS = bgTexture.wrapT = THREE.RepeatWrapping;

        const texture = loader.load(
            '/2k_stars.jpeg',
            () => {
                texture.mapping = THREE.EquirectangularReflectionMapping;
                texture.colorSpace = THREE.SRGBColorSpace;
                this.scene.background = texture;
            });
        bgTexture.colorSpace = THREE.SRGBColorSpace;
        // bgTexture.flipY = false;

        let backgroundBall = new THREE.Mesh(
            new THREE.SphereGeometry(250, 128, 128),
            new THREE.MeshPhysicalMaterial({
                map: bgTexture,
                // side: THREE.DoubleSide,
                // transparent: true
            })
        );
        backgroundBall.position.y = 700;
        // backgroundBall.geometry.scale(-1, 1, 1);
        this.scene.add(backgroundBall);
    }
    setRenderer() {
            this.renderer = new THREE.WebGLRenderer();
            // 设置画布的大小
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            //这里 其实就是canvas 画布  renderer.domElement
            const $dom = document.getElementById('canvas');
            $dom.appendChild(this.renderer.domElement);
        }
        // 设置环境光
    setLight() {
        this.ambientLight = new THREE.AmbientLight(0xffffff); // 环境光
        const light = new THREE.PointLight(0xffffff, 1.0);
        light.position.set(500, 500, 0);
        this.scene.add(light);
        this.scene.add(this.ambientLight);
    }
    loadModel() {
        const loader = new GLTFLoader();
        let _this = this;
        loader.load(
            '/stage-texture.glb',
            function(gltf) {
                gltf.scene.scale.set(60, 10, 60);
                _this.scene.add(gltf.scene);
            })
    }
    getRandomInRange(min, max) { // min and max included 
        return Math.floor(Math.random() * (max - min + 1) + min)
    }
    async createAreaCone(parent) {
        const RADIUS = {
            LEVEL_2_RADIUS: 800,
            LEVEL_1_RADIUS: 400
        }
        const radiusTop = RADIUS.LEVEL_2_RADIUS - 21;
        const radiusBottom = RADIUS.LEVEL_2_RADIUS;
        const height = 256;
        const num = this.provinces.length;
        if (!num) {
            return;
        }
        //如果数组总长小于5 则取最大的奇数作为展示的个数
        if (num < this.displayRegionNum) {
            this.displayRegionNum = Math.floor((num - 1) / 2) * 2 + 1;
        }
        let curIndex = (this.displayRegionNum - 1) / 2;
        this.selectedRegion = this.provinces[curIndex];
        const theta = (2 * Math.PI) / 3;
        const coneGeo = new THREE.CylinderGeometry(
            radiusTop,
            radiusBottom,
            height,
            64,
            1,
            true,
            0,
            theta
        );
        const canvasDom = await this.redrawSelectorCanvas();
        const regionSelectorTexture = new THREE.CanvasTexture(canvasDom);
        regionSelectorTexture.anisotropy = 16;
        regionSelectorTexture.wrapS = THREE.RepeatWrapping;
        regionSelectorTexture.repeat.set(1, 1);
        this.regionSelector = new THREE.Mesh(
            coneGeo,
            new THREE.MeshBasicMaterial({
                map: regionSelectorTexture,
                transparent: true,
                side: THREE.DoubleSide,
            })
        );
        this.regionSelector.position.y = height / 2;
        this.regionSelector.rotation.y = (-theta - Math.PI) / 2;
        this.regionSelector.name = "regionSelector";
        parent.add(this.regionSelector);
    }
    createCanvasImg(url) {
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext('2d');
        let image = new Image()
        image.src = url;
        image.onload = function() {
            canvas.width = image.width;
            canvas.height = image.height;
            ctx.drawImage(image, 0, 0);
        }
        return ctx;
    }
    getWrapText(ctx, text = "", maxWidth = 100) {
        let txtList = [];
        let str = "";
        for (let i = 0, len = text.length; i < len; i++) {
            str += text.charAt(i);
            if (ctx.measureText(str).width > maxWidth) {
                txtList.push(str.substring(0, str.length - 1))
                str = ""
                i--
            }
        }
        txtList.push(str)
        return txtList;
    }
    async slideRegionSelector(offsetFac) {
        if (offsetFac) {
            let len = this.provinces.length;
            let texture = this.regionSelector.material.map;
            let preIndex = this.provinces.findIndex(
                (item) => item.id == this.selectedRegion.id
            );
            let curIndex = (preIndex + offsetFac) % len;
            curIndex < 0 && (curIndex += len);
            this.selectedRegion = this.provinces[curIndex];
            await this.redrawSelectorCanvas(texture.image);
            texture.needsUpdate = true;
            texture.offset.x += offsetFac / len;
        }
    }
    async redrawSelectorCanvas(canvas) {
        if (!this.buttonImg) {
            this.buttonImg = document.getElementById('img')
        }
        const scaleNum = window.devicePixelRatio;
        if (!canvas) {
            canvas = document.createElement("canvas");
            //将canvas放大一定倍数，改善canvas绘到场景中出现模糊失真的问题
            canvas.width =
                this.buttonImg.naturalWidth *
                this.provinces.length *
                scaleNum;
            canvas.height = this.buttonImg.naturalHeight * scaleNum;
        }
        const ctx = canvas.getContext("2d");
        ctx.scale(scaleNum, scaleNum);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const pat = ctx.createPattern(this.buttonImg, "repeat-x");
        ctx.fillStyle = pat;
        console.log(canvas.width, canvas.height)
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = "12px ";
        ctx.textAlign = "center";
        // ctx.textAlign = "start"
        // ctx.textBaseline = "top"
        ctx.textBaseline = "middle";
        ctx.shadowColor = "#000";
        // ctx.shadowBlur = 8;
        // ctx.shadowOffsetX = 5;
        // ctx.shadowOffsetY = 5;
        ctx.fillStyle = "#ff0000";
        // var gradient = ctx.createLinearGradient(0, 0, 80, 0);
        // gradient.addColorStop("0", "magenta");
        // gradient.addColorStop("0.5", "blue");
        // gradient.addColorStop("1.0", "red");
        // // Fill with gradient
        // ctx.fillStyle = gradient;
        // ctx.fillText("河南省", 10, 30, 200);
        this.provinces.forEach((item, i) => {
            ctx.fillStyle = "#ff0000"
                // item.id == this.selectedRegion.id ?
                //     (ctx.fillStyle = "#FFA22C") :
                //     (ctx.fillStyle = "#ffffff");
            let left = (i + 0.5) * this.buttonImg.naturalWidth;
            let top = this.buttonImg.naturalHeight / 2;
            let lineHeight = 16;
            this.getWrapText(ctx, item, 100).forEach((txt, index) => {
                ctx.fillText(txt, left, 40 + lineHeight * index);
            })

            // ctx.fillText(
            //     "21:09鹤壁220千伏衡山站",
            //     (i + 0.5) * this.buttonImg.naturalWidth,
            //     this.buttonImg.naturalHeight / 2,
            //     512
            // );
        });
        return canvas;
    }
    initFlyLines() {
        const RADIUS = {
            LEVEL_2_RADIUS: 800,
            LEVEL_1_RADIUS: 400
        }
        const HEIGHT = {
            LEVEL_1_HEIGHT: 600
        }
        const group = new THREE.Group();
        const lineMaterial = new THREE.LineDashedMaterial({
            color: 0x00ff7f,
            side: THREE.DoubleSide,
            dashSize: 1,
            gapSize: 1,
            transparent: true,
            opacity: 0.6,
        });
        const startMinRadius = RADIUS.LEVEL_2_RADIUS - 60;
        const startMaxRadius = RADIUS.LEVEL_2_RADIUS - 30;
        const endMinRadius = RADIUS.LEVEL_1_RADIUS / 2;
        const endMaxRadius = RADIUS.LEVEL_1_RADIUS;
        for (let i = 0; i < 50; i++) {
            const startRadius = this.getRandomInRange(
                startMinRadius,
                startMaxRadius
            );
            const endRadius = this.getRandomInRange(
                endMinRadius,
                endMaxRadius
            );
            const theta = Math.random() * Math.PI * 2;
            const curve = new THREE.CubicBezierCurve3(
                new THREE.Vector3(
                    startRadius * Math.sin(theta),
                    0,
                    startRadius * Math.cos(theta)
                ),
                new THREE.Vector3(
                    startRadius * Math.sin(theta),
                    80,
                    startRadius * Math.cos(theta)
                ),
                new THREE.Vector3(
                    endRadius * Math.sin(theta),
                    HEIGHT.LEVEL_1_HEIGHT - 70,
                    endRadius * Math.cos(theta)
                ),
                new THREE.Vector3(
                    endRadius * Math.sin(theta),
                    HEIGHT.LEVEL_1_HEIGHT,
                    endRadius * Math.cos(theta)
                )
            );
            const points = curve.getPoints(50);
            const lineGeo = new THREE.BufferGeometry();


            let pointsArr = []
            points.forEach(e => {
                pointsArr.push(e.x, e.y, e.z)
            });
            const vertices = new Float32Array(pointsArr);
            lineGeo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
            const line = new THREE.Line(lineGeo, lineMaterial);
            line.computeLineDistances();
            const map = new THREE.TextureLoader().load('star.png');
            const material = new THREE.SpriteMaterial({ map: map });

            // const sprite = new THREE.Sprite(material);
            // this.scene.add(sprite);
            // // const lightPoint = this.getSprite("light-point.png");
            // sprite.scale.set(3, 3);
            // sprite.position.set(
            //     startRadius * Math.sin(theta),
            //     0,
            //     startRadius * Math.cos(theta)
            // );
            // this.runLightPoint(sprite, points);
            group.add(line);
        }
        let dashline = this.createCircle(true, 0x00ffff, 400)
        dashline.position.y = 600;
        this.scene.add(dashline);

        let line1 = this.createCircle(false, 0x00ffff, 450)
        line1.position.y = 600;
        this.scene.add(line1);



        let dashlineEarth = this.createCircle(true, 0xfee420, 500)
        dashlineEarth.position.y = 700;
        this.scene.add(dashlineEarth);

        let lineEarth = this.createCircle(false, 0xfee420, 400)
        lineEarth.position.y = 700;
        this.scene.add(lineEarth);



        let line = this.createCircle(false, 0x00ffff, 800)
        this.scene.add(line);
        this.scene.add(group);
    }

    createCircle(isdash, color, radius) {
        var geometry = new THREE.BufferGeometry();
        // 创建圆弧对象 ArcCurve，参数：0, 0圆弧坐标原点x，y 100：圆弧半径 0, 2 * Math.PI：圆弧起始角度；
        var arcCurve = new THREE.ArcCurve(0, 0, radius, 0, 2 * Math.PI).getPoints(50);
        let pointsArr = []
        arcCurve.forEach(e => {
            pointsArr.push(e.x, 0, e.y)
        });
        const vertices = new Float32Array(pointsArr);
        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        var material = new THREE.LineBasicMaterial({ color: color, linewidth: 4 });
        const dashLineMaterial = new THREE.LineDashedMaterial({
            color: color,
            linewidth: 1,
            scale: 1,
            dashSize: 3,
            gapSize: 10,
        });
        var line = new THREE.Line(geometry, isdash ? dashLineMaterial : material);
        line.computeLineDistances();
        return line;
    }
    runLightPoint(object, arr) {
            let index = 0;
            let fac = 10;
            const animationFrameId = Symbol();
            let vm = this;
            let timer = null;

            function step() {
                if (timer) {
                    clearTimeout(timer);
                    timer = null;
                }
                index++;
                if (index == arr.length * fac) {
                    index = 0;
                }
                if (index % fac == 0) {
                    object.position.set(
                        arr[index / fac].x,
                        arr[index / fac].y,
                        arr[index / fac].z
                    );
                }
                vm.lightPointAfids[animationFrameId] = requestAnimationFrame(
                    step
                );
            }
            timer = setTimeout(step, Math.random() * 1000 * fac);
        }
        //弹框显隐及其动画控制
    handleLabelVisibilityChange(label) {
            let scale = [
                { x: 1, y: 1, z: 1 },
                { x: 0, y: 0, z: 0 },
            ];
            let [start, end] = !label.visible ? scale.reverse() : scale;
            const tween = new Tween.Tween(start)
                .to(end, 1000)
                .easing(Tween.Easing.Quadratic.InOut)
                .onUpdate(() => {
                    //将模型尺寸缩放到0的时候，帧率低页面卡顿，将没有尺寸的模型隐藏解决帧率突然降低的问题
                    //模型尺寸缩放到零后将visible置为false，模型尺寸开始放大前将visible置为true
                    if (label.visible != Boolean(start.x)) {
                        label.visible = Boolean(start.x);
                    }
                    label.scale.set(start.x, start.y, start.z);
                })
                .start();
        }
        // 渲染
    render() {
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }

    // 动画
    animate() {
        requestAnimationFrame(this.animate.bind(this));
        // console.log("scene", this.scene)
        // Tween.update();
        this.scene.children[0].rotation.y += 0.01;
        this.render();
    }
}