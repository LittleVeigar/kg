<template>
  <h3 id="title">知识图谱智能推荐</h3>
  <main class="cd__main">
  <div class="carousel"  :class="{showdetail:showResult}" >
    <div class="detail" >
      <el-input
      v-model="textarea"
      :autosize="{ minRows: 4, maxRows: 10 }"
      type="textarea"
      placeholder="请输入缺陷描述"
    />
    <el-button class="recomend-btn" @click="recommendFn"  type="primary">智能推荐</el-button>
    </div>
  </div>
  <div class="carousel" >
    <div class="carousel__body">
      <div :class="{ switchbtn: !showResult }"  class="carousel__prev"><i class="far fa-angle-left"></i></div>
      <div :class="{ switchbtn: !showResult }"  class="carousel__next"><i class="far fa-angle-right"></i></div>
      <div class="carousel__slider">
        <!-- <div v-if="result[0]" class="carousel__slider__item">
          <div class="item__3d-frame">
            <div class="item__3d-frame__box item__3d-frame__box--front">
              <div>
                  <span>
                    缺陷类型:
                  </span>
                  <span>
                    {{ result[0].defect }}
                  </span>
              </div>
              <div>
                <span>缺陷原因:</span>
                 <span>{{ result[0].reason }}</span>
              </div>
              <div>
                  <span>缺陷设备:</span>
                  <span>{{ result[0].device }}</span>
                </div>
              <div>
                <span>
                  解决方法：
                </span>
                 <span>{{ result[0].method }}</span>
              </div>
              <div>
                <span>
                  缺陷描述：
                </span>
                {{ result[0].data }}
                
              </div>
              <div>
                <span>消缺说明：</span>
                 <span>
                    {{ result[0].solution }}
                  </span>
              </div>
            </div>
            <div class="item__3d-frame__box item__3d-frame__box--left"></div>
            <div class="item__3d-frame__box item__3d-frame__box--right"></div>
          </div>
        </div> -->
        <div v-for="(item,index) in result" :key="index" class="carousel__slider__item">
            <div class="item__3d-frame">
              <div class="item__3d-frame__box item__3d-frame__box--front">
                <h3>{{ index+1 }}</h3>
                <div>
                    <span>
                      缺陷类型:
                    </span>
                    <span>
                      {{ item.defect }}
                    </span>
                </div>
                <div>
                  <span>缺陷原因:</span>
                  <span>{{ item.reason }}</span>
                </div>
                <div>
                    <span>缺陷设备:</span>
                    <span>{{ item.device }}</span>
                  </div>
                <div>
                  <span>
                    解决方法：
                  </span>
                  <span>{{ item.method }}</span>
                </div>
                <div>
                  <span>
                    缺陷描述：
                  </span>
                  <span>
                    {{ item.data }}
                  </span>
                </div>
                <div>
                  <span>消缺说明：</span>
                  <span>
                     {{ item.solution }}
                  </span>
                </div>
              </div>
              <div class="item__3d-frame__box item__3d-frame__box--left"></div>
              <div class="item__3d-frame__box item__3d-frame__box--right"></div>
            </div>
        </div>
        
        <!-- <div class="carousel__slider__item">
          <div class="item__3d-frame">
            <div class="item__3d-frame__box item__3d-frame__box--front">
              <h1>2</h1>
            </div>
            <div class="item__3d-frame__box item__3d-frame__box--left"></div>
            <div class="item__3d-frame__box item__3d-frame__box--right"></div>
          </div>
        </div>
        <div class="carousel__slider__item">
          <div class="item__3d-frame">
            <div class="item__3d-frame__box item__3d-frame__box--front">
              <h1>3</h1>
            </div>
            <div class="item__3d-frame__box item__3d-frame__box--left"></div>
            <div class="item__3d-frame__box item__3d-frame__box--right"></div>
          </div>
        </div>
        <div class="carousel__slider__item">
          <div class="item__3d-frame">
            <div class="item__3d-frame__box item__3d-frame__box--front">
              <h1>4</h1>
            </div>
            <div class="item__3d-frame__box item__3d-frame__box--left"></div>
            <div class="item__3d-frame__box item__3d-frame__box--right"></div>
          </div>
        </div>
        <div class="carousel__slider__item">
          <div class="item__3d-frame">
            <div class="item__3d-frame__box item__3d-frame__box--front">
              <h1>5</h1>
            </div>
            <div class="item__3d-frame__box item__3d-frame__box--left"></div>
            <div class="item__3d-frame__box item__3d-frame__box--right"></div>
          </div>
        </div> -->
      </div>
    </div>
  </div>
  <el-icon v-if="showResult" @click="refreshFn" class="refresh-icon"><RefreshRight /><span class="text">重置</span></el-icon>
  </main>
  
</template>
<script  >
import neo4j from "neo4j-driver";
var carousel,
  slider,
  items,
  prevBtn,
  nextBtn;

var width, height, totalWidth, margin = 20,
  currIndex = 0,
  interval, intervalTime = 4000;

export default {
  name: "recommend",
  data() {
    return {
      db: {
        // 数据库连接配置：
        uri: "neo4j://localhost", // 		neo4j地址（不给端口默认7687）
        // uri : "http://127.0.0.1:7687",  // 		neo4j地址（不给端口默认7687）
        user: "neo4j", // 		数据库用户名(默认neo4j，修改成自己的)
        password: "@Mutong@1214", // 		数据库密码（默认ne4oj，修改成自己的）
      },
      textarea:"",
      showResult:false,
      nodeName: "",
      pageNum: 100,
      driver: null,
      myGraph: null, // 3D-graph对象
      graphData: null, // 3D-graph加载的图数据
      result: [{},{},{},{},{}],
    };
  },
  mounted() {
    carousel = document.getElementsByClassName('carousel')[1],
      slider = carousel.getElementsByClassName('carousel__slider')[0],
      items = carousel.getElementsByClassName('carousel__slider__item'),
      prevBtn = carousel.getElementsByClassName('carousel__prev')[0],
      nextBtn = carousel.getElementsByClassName('carousel__next')[0];
    this.init()
    this.driver = neo4j.driver(
      this.db.uri,
      neo4j.auth.basic(this.db.user, this.db.password)
    );
  },
  watch:{
    showResult(newdata,olddata){
      if(newdata){
        // carousel = document.getElementsByClassName('carousel')[1],
        //   slider = carousel.getElementsByClassName('carousel__slider')[0],
        //   items = carousel.getElementsByClassName('carousel__slider__item'),
        //   prevBtn = carousel.getElementsByClassName('carousel__prev')[0],
        //   nextBtn = carousel.getElementsByClassName('carousel__next')[0];
        this.init()
      }
    }
  },
  methods: {
    init() {
      this.resize();
      this.move(Math.floor(items.length / 2));
      this.bindEvents();

      // this.timer();
    },
    async getCyperResult(str) {
      const session = this.driver.session();
      const result = await session.run(
        "CALL db.index.fulltext.queryNodes('defectDataIndex', 'data: " + str + "') " +
        "YIELD node, score " +
        "RETURN node, score" +
        " LIMIT 5",
      );

     
      if (!result.records[0]) {
        ElNotification({
          message: "未匹配到数据",
        })
        return;
      }else{
        let res =  result.records.map(e=>{
          let props = e.get('node').properties;
          return props
        })

        this.result = res;
        this.init()

         console.log('result', res)
      }

      // let data = result.records[0]?.get('node').properties;
      // console.log('result', result.records[0].get('node').properties)
      // this.form = {
      //   ...this.form,
      //   reason: data.reason,
      //   device: data.device,
      //   type: data.defect,
      //   method: data.method
      // }
    },
    recommendFn(){
      this.getCyperResult(this.textarea);
      this.showResult = true
    },
    refreshFn(){
      this.showResult = false;
      this.textarea=""
    },
    resize() {
      width = Math.max(window.innerWidth * .25, 800),
        height = window.innerHeight * .5,
        totalWidth = width * items.length;
      slider.style.width = totalWidth + "px";
      for (var i = 0; i < items.length; i++) {
        let item = items[i];
        item.style.width = (width - (margin * 2)) + "px";
        item.style.height = height + "px";
      }
    },
    move(index) {
      if (index < 1) index = items.length;
      if (index > items.length) index = 1;
      currIndex = index;
      for (var i = 0; i < items.length; i++) {
        let item = items[i],
          box = item.getElementsByClassName('item__3d-frame')[0];
        if (i == (index - 1)) {
          item.classList.add('carousel__slider__item--active');
          box.style.transform = "perspective(1200px)";
        } else {
          item.classList.remove('carousel__slider__item--active');
          box.style.transform = "perspective(1200px) rotateY(" + (i < (index - 1) ? 40 : -40) + "deg)";
        }
      }
      slider.style.transform = "translate3d(" + ((index * -width) + (width / 2) + window.innerWidth / 2) + "px, 0, 0)";
    },
    timer() {
      // clearInterval(interval);
      // interval = setInterval(() => {
      //   this.move(++currIndex);
      // }, intervalTime);
    },
    prev() {
      this.move(--currIndex);
      // this.timer();
    },
    next() {
      this.move(++currIndex);
      // console.log('tag', currIndex)
      // this.timer();
    },
    bindEvents() {
      prevBtn.removeEventListener('click', this.prev);
      nextBtn.removeEventListener('click', this.next);

      window.onresize = this.resize;
      prevBtn.addEventListener('click', this.prev);
      nextBtn.addEventListener('click', this.next);
    },

    // async getCyperResult(limit_items) {
    //   const session = this.driver.session();
    //   const result = await session.run(
    //     "MATCH (n)-[r]-(m) RETURN * " + "LIMIT $limit_items ",
    //     { limit_items: neo4j.int(limit_items) }
    //   );

    //   const node_info = {};
    //   const rel_info = {};
    //   result.records.map((k) => {
    //     node_info[k.get("n")["properties"]["uid"]] = {
    //       labels: k.get("n")["labels"].toString(),
    //       attrs: k.get("n")["properties"],
    //     };
    //     node_info[k.get("m")["properties"]["uid"]] = {
    //       labels: k.get("m")["labels"].toString(),
    //       attrs: k.get("m")["properties"],
    //     };
    //     rel_info[k.get("r").toString()] = {
    //       source: k.get("n")["properties"]["uid"],
    //       target: k.get("m")["properties"]["uid"],
    //     };
    //   });

    //   return {
    //     node_info,
    //     rel_info,
    //   };
    // },
    
  },
};
</script>


<style lang="less" scoped>
h6 {
  color: #fff;
}
#title {
  position: absolute;
  top:-10px;
  z-index: 3;
  left: 50%;
  transform: translateX(-50%);
  /* color: #00a287; */
  backdrop-filter: blur(6px);
  font-size: 30px;
  color: #fff;
  width: 600px;
  /* height: 60px; */
  /* background-color: transparent; */
  /* background: linear-gradient(to bottom, white 0%, #f49602 100%); */
  background-image: url("../assets/title-bg.png");
  background-size: 100% 100%;
}

.detail {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content:space-between;

  width: 60%;
  left: 50%;
  top: 30%;
  transform: translateX(-50%);

  .recomend-btn {
    margin-left: 20px;
  }
}
.refresh-icon {
  position: absolute;
  left: 50%;
  bottom: 40px;
  width: 200px;
  cursor: pointer;
  transform: translateX(-50%);
  .text {
    margin-left: 5px;
  }
}
.switchbtn {
  height: 0;
  overflow: hidden;
}
#canvas {
  width: 100%;
  height:100vh;
}

#graph {
  background-color: black;
  background-image: url("/bg.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
// .cd__main {
//   background-color: black;
//   background-image: url("/bg.png");
//   background-size: 100% 100%;
//   background-repeat: no-repeat;
//   // width: 100vw;
// }

.search {
  position: absolute;
  bottom: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
  color: #fff;
  font-size: 12px;
  font-weight: 500;
}
.carousel {
  position: relative;
  display: block;
  width: 100vw;
  height: 100vh;
  // top:200px;
  margin-top: 120px;
  // min-height: 640px;
  box-sizing: border-box;
}
.showdetail {
  height: 0;
  margin-top: 0;
  .detail {
    height: 0;
    overflow: hidden;
  }
}
.carousel__prev, .carousel__next {
  position: fixed;
  bottom: 80px;
  transition: transform 0.25s ease;
}
.carousel__prev i, .carousel__next i {
  font-size: 60px;
  color: var(--box-border);
  cursor: pointer;
}
.carousel__prev:hover, .carousel__next:hover {
  transform: scale(1.25);
}
.carousel__prev {
  left: 40%;
}
.carousel__next {
  right: 40%;
}
.carousel__body {
  width: 100%;
  padding: 20px 0 50px 0;
  overflow: hidden;
}
.carousel__body .carousel__slider {
  position: relative;
  transition: transform 1s ease-in-out;
  background: var(--crsl-bg);
}
.carousel__body .carousel__slider__item {
  position: relative;
  display: block;
  float: left;
  box-sizing: border-box;
  margin-left: 20px;
  margin-right: 20px;
}
.carousel__body .carousel__slider__item .item__3d-frame {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 1s ease-in-out;
  -webkit-transform-style: preserve-3d;
  transform-style: preserve-3d;
}
.carousel__body .carousel__slider__item .item__3d-frame:after {
  content: "";
  position: absolute;
  bottom: -15%;
  width: 100%;
  height: 40px;
  background: var(--box-shadow);
  left:0;
  box-shadow: 0px 0px 5px 5px var(--box-shadow);
  transform: rotateX(90deg) translate3d(0px, -20px, 0px);
  opacity: 0.85;
}
.carousel__body .carousel__slider__item .item__3d-frame__box {
  // display: flex;
  // align-items: center;
  // vertical-align: middle;
  text-align: center;
  position: absolute;
  width: 100%;
  height: 100%;
  padding: 40px;
  box-sizing: border-box;
  border-color: var(--box-border);
  background: var(--box-bg);
  border-width: 3px;
  border-style: solid;
  font-size: 1rem;
}
.carousel__body .carousel__slider__item .item__3d-frame__box h1 {
  font-size: 7em;
  width: 100%;
  color: var(--box-border);
}
.carousel__body .carousel__slider__item .item__3d-frame__box--right, .carousel__body .carousel__slider__item .item__3d-frame__box--left {
  top: 0;
  width: 40px;
  backface-visibility: hidden;
}
.carousel__body .carousel__slider__item .item__3d-frame__box--left {
  left: 0;
  border-left-width: 5px;
  transform: translate3d(1px, 0, -40px) rotateY(-90deg);
  transform-origin: 0%;
}
.carousel__body .carousel__slider__item .item__3d-frame__box--right {
  right: 0;
  border-right-width: 5px;
  transform: translate3d(-1px, 0, -40px) rotateY(90deg);
  transform-origin: 100%;
}
.cd__intro{
   padding: 60px 30px;
   margin-bottom: 15px;
        flex-direction: column;

}
.cd__intro,
.cd__credit{
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: center;
    background: #fff;
    color: #333;
    line-height: 1.5;
    text-align: center;
}

.cd__intro h1 {
   font-size: 18pt;
   padding-bottom: 15px;

}
.cd__intro p{
   font-size: 14px;
}

.cd__action{
   text-align: center;
   display: block;
   margin-top: 20px;
}

.cd__action a.cd__btn {
  text-decoration: none;
  color: #666;
   border: 2px solid #666;
   padding: 10px 15px;
   display: inline-block;
   margin-left: 5px;
}
.cd__action a.cd__btn:hover{
   background: #666;
   color: #fff;
    transition: .3s;
-webkit-transition: .3s;
}
.cd__action .cd__btn:before{
  font-family: FontAwesome;
  font-weight: normal;
  margin-right: 10px;
}
.down:before{content: "\f019"}
.back:before{content:"\f112"}

.cd__credit{
    padding: 12px;
    font-size: 9pt;
    margin-top: 40px;

}
.cd__credit span:before{
   font-family: FontAwesome;
   color: #e41b17;
   content: "\f004";


}
.cd__credit a{
   color: #333;
   text-decoration: none;
}
.cd__credit a:hover{
   color: #1DBF73; 
}
.cd__credit a:hover:after{
    font-family: FontAwesome;
    content: "\f08e";
    font-size: 9pt;
    position: absolute;
    margin: 3px;
}
.cd__main{
  // background: #fff;
  background-color: black;
  background-image: url("/bg.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  // padding: 20px;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  max-height: 100vh;
  overflow: hidden;
}
.cd__main{
    display: flex;
    width: 100%;
}
.fa-angle-left {
  display: inline-block;
  width: 60px;
  height: 60px;
  background: url("../assets/prev.png");
  background-size:cover;
}
.fa-angle-right {
  .fa-angle-left;
  transform: rotate(180deg);
}

@media only screen and (min-width: 1360px){
    .cd__main{
      // max-width: 1280px;
      margin-left: auto;
      margin-right: auto; 
      padding: 24px;
    }
}
</style>
