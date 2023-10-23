<script  >
import ForceGraph from "force-graph";
import neo4j from "neo4j-driver";
import { ElNotification } from "element-plus";
import { h } from "vue";


const colorMap = {
  原因: "rgb(76, 142, 218)",
  方法: "rgb(86, 148, 128)",
  缺陷: "rgb(255, 196, 84)",
  设备: "rgb(241, 102, 103)",
};

//知识图谱前端增加安防、远动、专网、PMU专业分类功能、优化界面展示功能、知识图谱汇报进展PPT编写。

export default {
  name: "graph",
  data() {
    return {
      nodeNum: 0,
      linkNum: 0,
      startNode: "",
      layoutType: "radialout",
      current: null,
      endNode: "",
      close:false,
      close1:false,
      close2: false,
      nodeName: "",
      pageNum: 100,
      driver: null,
      myGraph: null, // 3D-graph对象
      graphData: null, // 3D-graph加载的图数据
      result: {},
      options: [
        {
          label: "cm",
          value: "",
        },
        {
          label: "td",
          value: "td",
        },
        {
          label: "bu",
          value: "bu",
        },
        {
          label: "lr",
          value: "lr",
        },
        {
          label: "rl",
          value: "rl",
        },
        {
          label: "radialout",
          value: "radialout",
        },
        {
          label: "radialin",
          value: "radialin",
        },
      ],
      pageOptions: [
        {
          label: "100/页",
          value: 100,
        },
        {
          label: "200/页",
          value: 200,
        },
        {
          label: "500/页",
          value: 500,
        },
        {
          label: "1000/页",
          value: 1000,
        },
        {
          label: "2000/页",
          value: 2000,
        },
        {
          label: "5000/页",
          value: 5000,
        },
      ],
      db: {
        // 数据库连接配置：
        uri: "neo4j://localhost", // 		neo4j地址（不给端口默认7687）
        // uri : "http://127.0.0.1:7687",  // 		neo4j地址（不给端口默认7687）
        user: "neo4j", // 		数据库用户名(默认neo4j，修改成自己的)
        password: "@Mutong@1214", // 		数据库密码（默认ne4oj，修改成自己的）
      },
    };
  },
  watch: {
    // 此处监听variable变量，当期有变化时执行
    layoutType(item1, item2) {
      this.myGraph.dagMode(item1);
      // item1为新值，item2为旧值
    },
  },
  mounted() {
    const elem = document.getElementById("graph");

    const Graph = ForceGraph()(elem);
    this.myGraph = Graph;
    // fetch("/miserables.json")
    //   .then((res) => res.json())
    //   .then((data) => {
    //     Graph.dagMode()
    //       // .graphData(data)
    //       // .nodeLabel("id")
    //       .dagLevelDistance(300)
    //       .nodeRelSize(4)
    //       .nodeAutoColorBy("labels")
    //       .linkColor(() => "rgba(0,0,0,0.4)")
    //       .linkVisibility(true)
    //       .linkDirectionalParticles(1)
    //       .linkDirectionalParticleWidth(1.4)
    //       .onNodeClick((node) => {
    //         // Center/zoom on node
    //         Graph.centerAt(node.x, node.y, 1000);
    //         Graph.zoom(8, 2000);
    //       });
    //   });
    this.driver = neo4j.driver(
      this.db.uri,
      neo4j.auth.basic(this.db.user, this.db.password)
    );
    this.init(Graph);

    this.getStatistic();
  },
  methods: {
    async init(Graph) {
      let graph_info = await this.getCyperResult(100);
      /** 构造3D-Graph数据的边 */
      if (!graph_info) return;
      const links = Object.values(graph_info.rel_info);
      /** 构造3D-Graph数据的节点 */
      const nodes = Object.entries(graph_info.node_info).map((entry) => {
        return { id: entry[0], labels: entry[1].labels, attrs: entry[1].attrs };
      });
      this.graphData = {
        nodes: nodes,
        links: links,
      };

      Graph.graphData({
        nodes: nodes,
        links: links,
      });

      Graph.nodeLabel((node) => {
        return node.attrs.name;
      })
        .dagMode("")
        .dagLevelDistance(100)
        .nodeRelSize(6)
        .nodeAutoColorBy((node) => {
          return "#f0f";
        })
        .linkColor(() => "rgba(255,255,255,0.4)")
        .linkVisibility(true)
        .linkDirectionalParticles(1)
        .linkDirectionalParticleWidth(1.4)
        // .nodeCanvasObject((node, ctx, globalScale) => {
        //   const label = node.attrs.name;
        //   const fontSize = 10 / globalScale;
        //   // 画圆
        //   ctx.beginPath(); //开始绘制
        //   ctx.arc(node.x, node.y, 20, 0, 2 * Math.PI); //arc 的意思是“弧”
        //   ctx.fillStyle = "rgb(241, 102, 103)"; //设置填充颜色
        //   ctx.fill(); //开始填充
        //   ctx.strokeStyle = "#eb2728"; //将线条颜色设置为蓝色
        //   ctx.stroke();
        //   // 写字
        //   ctx.font = `${fontSize}px Sans-Serif`;
        //   ctx.textAlign = "center";
        //   ctx.textBaseline = "middle";
        //   ctx.fillStyle = "#fff"; //node.color;

        //   this.canvasWraptitleText(ctx, label, node.x, node.y);

        //   // ctx.fillText(label, node.x, node.y + 6);
        // })
        .onNodeClick((node) => {
          // Center/zoom on node
          console.log("node", node);
          this.showNode(node);
          this.current = node;
          Graph.centerAt(node.x, node.y, 1000);
          Graph.zoom(8, 2000);
        })
        .nodeCanvasObject((node, ctx, globalScale) => {
          const label = node.attrs.name;
          const fontSize = 2;
          ctx.font = `${fontSize}px Sans-Serif`;
          const textWidth = ctx.measureText(label).width;
          const bckgDimensions = [textWidth, fontSize].map(
            (n) => n + fontSize * 0.2
          ); // some padding

          ctx.beginPath(); //开始绘制
          ctx.arc(node.x, node.y, 6, 0, 2 * Math.PI); //arc 的意思是“弧”
          ctx.fillStyle = colorMap[node.labels]; //设置填充颜色
          ctx.fill(); //开始填充
          ctx.lineWidth = 0.2;
          ctx.strokeStyle = "#fff"; //将线条颜色设置为蓝色
          ctx.stroke();

          // ctx.fillRect(
          //   node.x - bckgDimensions[0] / 2,
          //   node.y - bckgDimensions[1] / 2,
          //   ...bckgDimensions
          // );

          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle = "#fff";
          ctx.fillText(label, node.x, node.y);

          node.__bckgDimensions = bckgDimensions; // to re-use in nodePointerAreaPaint
        })
        .nodePointerAreaPaint((node, color, ctx) => {
          ctx.fillStyle = color;
          const bckgDimensions = node.__bckgDimensions;
          bckgDimensions &&
            ctx.fillRect(
              node.x - bckgDimensions[0] / 2,
              node.y - bckgDimensions[1] / 2,
              ...bckgDimensions
            );
        });
    },
    async getCyperResult(limit_items) {
      const session = this.driver.session();
      const result = await session.run(
        "MATCH (n)-[r]-(m) RETURN * " + "LIMIT $limit_items ",
        { limit_items: neo4j.int(limit_items) }
      );

      /* 存储节点和边信息
       * node_info[节点ID] = {节点标签：list, 节点属性:dict}
       *   rel_info[边ID] = {  边类别：str,   边属性:dict}
       */
      const node_info = {};
      const rel_info = {};
      result.records.map((k) => {
        node_info[k.get("n")["properties"]["uid"]] = {
          labels: k.get("n")["labels"].toString(),
          attrs: k.get("n")["properties"],
        };
        node_info[k.get("m")["properties"]["uid"]] = {
          labels: k.get("m")["labels"].toString(),
          attrs: k.get("m")["properties"],
        };
        rel_info[k.get("r").toString()] = {
          source: k.get("n")["properties"]["uid"],
          target: k.get("m")["properties"]["uid"],
        };
      });

      return {
        node_info,
        rel_info,
      };
    },
    //直接this点调用方法
    //x , y 绘制的坐标
    //maxWigth 绘制文字的宽度
    //lineHeight 行高
    //maxRowNum 最大行数
    canvasWraptitleText(
      canvas,
      text,
      x,
      y,
      maxWidth = 60,
      lineHeight = 20,
      maxRowNum = 1
    ) {
      if (
        typeof text != "string" ||
        typeof x != "number" ||
        typeof y != "number"
      ) {
        return;
      }
      // 字符分隔为数组
      var arrText = text.split("");
      var line = "";
      var rowNum = 1;
      for (var n = 0; n < arrText.length; n++) {
        var testLine = line + arrText[n];
        var metrics = canvas.measureText(testLine);
        var testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
          if (rowNum >= maxRowNum) {
            var arrLine = testLine.split("");
            arrLine.splice(-9);
            var newTestLine = arrLine.join("");
            newTestLine += "...";
            canvas.fillText(newTestLine, x, y);
            //如果需要在省略号后面添加其他的东西，就在这个位置写（列如添加扫码查看详情字样）
            //canvas.fillStyle = '#2259CA';
            //canvas.fillText('扫码查看详情',x + maxWidth-90, y);
            return;
          }
          canvas.fillText(line, x, y);
          line = arrText[n];
          y += lineHeight;
          rowNum += 1;
        } else {
          line = testLine;
        }
      }
      canvas.fillText(line, x, y);
    },

    async searchNode(name, limit_items) {
      // MATCH (n:`原因`) RETURN n LIMIT 25
      const session = this.driver.session();
      let str = name ? ":" + name : "";
      const result = await session.run(
        "MATCH (n" + str + ") RETURN n" + " LIMIT " + limit_items
      );

      /* 存储节点和边信息
       * node_info[节点ID] = {节点标签：list, 节点属性:dict}
       *   rel_info[边ID] = {  边类别：str,   边属性:dict}
       */
      const node_info = {};
      const rel_info = {};
      result.records.map((k) => {
        node_info[k.get("n")["properties"]["uid"]] = {
          labels: k.get("n")["labels"].toString(),
          attrs: k.get("n")["properties"],
        };
        // node_info[k.get("m")["properties"]["uid"]] = {
        //   labels: k.get("m")["labels"].toString(),
        //   attrs: k.get("m")["properties"],
        // };
        // rel_info[k.get("r").toString()] = {
        //   source: k.get("n")["properties"]["uid"],
        //   target: k.get("m")["properties"]["uid"],
        // };
      });

      const links = Object.values(rel_info);
      /** 构造3D-Graph数据的节点 */
      const nodes = Object.entries(node_info).map((entry) => {
        return { id: entry[0], labels: entry[1].labels, attrs: entry[1].attrs };
      });

      this.myGraph.graphData({
        nodes: nodes,
        links: links,
      });

      // return {
      //   node_info,
      //   rel_info,
      // };
    },

    // async searchAllLink(limit_items) {
    //   const session = this.driver.session();
    //   // const result = await session.run(
    //   //   "MATCH (n)-[r*2..4]-(m) RETURN *  LIMIT " + limit_items
    //   // );

    //   const result = await session.run(
    //     "MATCH p=()-->() RETURN p LIMIT " + limit_items
    //   );

    //   console.log('result', result.records[0]._fields[0].start)

    //   console.log('p', result.records[0].get('p'))

    //   /* 存储节点和边信息
    //    * node_info[节点ID] = {节点标签：list, 节点属性:dict}
    //    *   rel_info[边ID] = {  边类别：str,   边属性:dict}
    //    */
    //   const node_info = {};
    //   const rel_info = {};
    //   result.records.map((k) => {
    //     node_info[k.get("p")["start"]["properties"]["uid"]] = {
    //       labels: k.get("p")["start"]["labels"].toString(),
    //       attrs: k.get("p")["start"]["properties"],
    //     };
    //     node_info[k.get("p")["end"]["properties"]["uid"]] = {
    //       labels: k.get("p")["end"]["labels"].toString(),
    //       attrs: k.get("p")["end"]["properties"],
    //     };
    //     rel_info[k.get("p")["segments"][0]["relationship"]["elementId"].toString()] = {
    //       source: k.get("p")["start"]["properties"]["uid"],
    //       target: k.get("p")["end"]["properties"]["uid"],
    //     };
    //   });

    //   const links = Object.values(rel_info);
    //   /** 构造3D-Graph数据的节点 */
    //   const nodes = Object.entries(node_info).map((entry) => {
    //     return { id: entry[0], labels: entry[1].labels, attrs: entry[1].attrs };
    //   });

    //   this.myGraph.graphData({
    //     nodes: nodes,
    //     links: links,
    //   });
    // },

    async searchAllLink(limit_items) {
      const session = this.driver.session();
      // const result = await session.run(
      //   "MATCH (n)<-[r]-(m) RETURN *  LIMIT " + limit_items
      // );

      const result1 = await session.run(
        "MATCH (n)-[r]->(m)-[p]->(x)-[t]->(y) RETURN * LIMIT " + limit_items
      );

      // console.log('result1', result1)

      // const result = await session.run(
      //   "MATCH p=()-->() RETURN p LIMIT " + limit_items
      // );

      // console.log('result', result.records[0]._fields[0].start)

      /* 存储节点和边信息
       * node_info[节点ID] = {节点标签：list, 节点属性:dict}
       *   rel_info[边ID] = {  边类别：str,   边属性:dict}
       */
      const node_info = {};
      const rel_info = {};
      // result.records.map((k) => {
      //   node_info[k.get("n")["properties"]["uid"]] = {
      //     labels: k.get("n")["labels"].toString(),
      //     attrs: k.get("n")["properties"],
      //   };
      //   node_info[k.get("m")["properties"]["uid"]] = {
      //     labels: k.get("m")["labels"].toString(),
      //     attrs: k.get("m")["properties"],
      //   };
      //   rel_info[k.get("r").toString()] = {
      //     source: k.get("n")["properties"]["uid"],
      //     target: k.get("m")["properties"]["uid"],
      //   };
      // });

      result1.records.map((k) => {
        node_info[k.get("n")["properties"]["uid"]] = {
          labels: k.get("n")["labels"].toString(),
          attrs: k.get("n")["properties"],
        };
        node_info[k.get("m")["properties"]["uid"]] = {
          labels: k.get("m")["labels"].toString(),
          attrs: k.get("m")["properties"],
        };
        node_info[k.get("x")["properties"]["uid"]] = {
          labels: k.get("x")["labels"].toString(),
          attrs: k.get("x")["properties"],
        };
        node_info[k.get("y")["properties"]["uid"]] = {
          labels: k.get("y")["labels"].toString(),
          attrs: k.get("y")["properties"],
        };
        rel_info[k.get("r").toString()] = {
          source: k.get("n")["properties"]["uid"],
          target: k.get("m")["properties"]["uid"],
        };
        rel_info[k.get("p").toString()] = {
          source: k.get("m")["properties"]["uid"],
          target: k.get("x")["properties"]["uid"],
        };
        rel_info[k.get("t").toString()] = {
          source: k.get("x")["properties"]["uid"],
          target: k.get("y")["properties"]["uid"],
        };
      });

      const links = Object.values(rel_info);
      /** 构造3D-Graph数据的节点 */
      const nodes = Object.entries(node_info).map((entry) => {
        return { id: entry[0], labels: entry[1].labels, attrs: entry[1].attrs };
      });

      this.myGraph.graphData({
        nodes: nodes,
        links: links,
      });
    },

    async fuzzySearchNode(str, limit_items) {
      // MATCH (n)
      // WHERE n.name CONTAINS '三'
      // RETURN n

      const session = this.driver.session();
      const result = await session.run(
        "MATCH (n)  WHERE n.name CONTAINS '" +
          str +
          "'  RETURN n" +
          " LIMIT " +
          limit_items
      );

      /* 存储节点和边信息
       * node_info[节点ID] = {节点标签：list, 节点属性:dict}
       *   rel_info[边ID] = {  边类别：str,   边属性:dict}
       */
      const node_info = {};
      const rel_info = {};
      result.records.map((k) => {
        node_info[k.get("n")["properties"]["uid"]] = {
          labels: k.get("n")["labels"].toString(),
          attrs: k.get("n")["properties"],
        };
      });

      const links = Object.values(rel_info);
      /** 构造3D-Graph数据的节点 */
      const nodes = Object.entries(node_info).map((entry) => {
        return { id: entry[0], labels: entry[1].labels, attrs: entry[1].attrs };
      });

      this.myGraph.graphData({
        nodes: nodes,
        links: links,
      });
    },
    async searchOneKindLink(str, limit_items) {
      const session = this.driver.session();
      const result = await session.run(
        "MATCH (n)-[r:" + str + "]-(m) RETURN *  LIMIT " + limit_items
      );

      /* 存储节点和边信息
       * node_info[节点ID] = {节点标签：list, 节点属性:dict}
       *   rel_info[边ID] = {  边类别：str,   边属性:dict}
       */
      const node_info = {};
      const rel_info = {};
      result.records.map((k) => {
        node_info[k.get("n")["properties"]["uid"]] = {
          labels: k.get("n")["labels"].toString(),
          attrs: k.get("n")["properties"],
        };
        node_info[k.get("m")["properties"]["uid"]] = {
          labels: k.get("m")["labels"].toString(),
          attrs: k.get("m")["properties"],
        };
        rel_info[k.get("r").toString()] = {
          source: k.get("n")["properties"]["uid"],
          target: k.get("m")["properties"]["uid"],
        };
      });

      const links = Object.values(rel_info);
      /** 构造3D-Graph数据的节点 */
      const nodes = Object.entries(node_info).map((entry) => {
        return { id: entry[0], labels: entry[1].labels, attrs: entry[1].attrs };
      });

      this.myGraph.graphData({
        nodes: nodes,
        links: links,
      });
    },
    async searchMajorLink(name, limit_items){
      const session = this.driver.session();
      const result = await session.run(
        "MATCH (n)-[r]->(m)-[p]->(x)-[t]->(y)" +
        " WHERE n.major CONTAINS '" +
        name +
        "' RETURN *" +
        " LIMIT " +
        limit_items
      );

      const node_info = {};
      const rel_info = {};
      result.records.map((k) => {
       node_info[k.get("n")["properties"]["uid"]] = {
          labels: k.get("n")["labels"].toString(),
          attrs: k.get("n")["properties"],
        };
        node_info[k.get("m")["properties"]["uid"]] = {
          labels: k.get("m")["labels"].toString(),
          attrs: k.get("m")["properties"],
        };
        node_info[k.get("x")["properties"]["uid"]] = {
          labels: k.get("x")["labels"].toString(),
          attrs: k.get("x")["properties"],
        };
        node_info[k.get("y")["properties"]["uid"]] = {
          labels: k.get("y")["labels"].toString(),
          attrs: k.get("y")["properties"],
        };
        rel_info[k.get("r").toString()] = {
          source: k.get("n")["properties"]["uid"],
          target: k.get("m")["properties"]["uid"],
        };
        rel_info[k.get("p").toString()] = {
          source: k.get("m")["properties"]["uid"],
          target: k.get("x")["properties"]["uid"],
        };
        rel_info[k.get("t").toString()] = {
          source: k.get("x")["properties"]["uid"],
          target: k.get("y")["properties"]["uid"],
        };
      });

      const links = Object.values(rel_info);
      /** 构造3D-Graph数据的节点 */
      const nodes = Object.entries(node_info).map((entry) => {
        return { id: entry[0], labels: entry[1].labels, attrs: entry[1].attrs };
      });

      this.myGraph.graphData({
        nodes: nodes,
        links: links,
      });
    },
    async searchDeepLink(start, end, limit_items) {
      //WHERE n.name='张三' AND type(r)=~ 'F.*'

      const session = this.driver.session();
      const result = await session.run(
        "MATCH (n)-[r]->(m)" +
          " WHERE n.name CONTAINS '" +
          start +
          "' AND m.name CONTAINS '" +
          end +
          "' RETURN *" +
          " LIMIT " +
          limit_items
      );


      /* 存储节点和边信息
       * node_info[节点ID] = {节点标签：list, 节点属性:dict}
       *   rel_info[边ID] = {  边类别：str,   边属性:dict}
       */
      const node_info = {};
      const rel_info = {};
      result.records.map((k) => {
        node_info[k.get("n")["properties"]["uid"]] = {
          labels: k.get("n")["labels"].toString(),
          attrs: k.get("n")["properties"],
        };
        node_info[k.get("m")["properties"]["uid"]] = {
          labels: k.get("m")["labels"].toString(),
          attrs: k.get("m")["properties"],
        };
        rel_info[k.get("r").toString()] = {
          source: k.get("n")["properties"]["uid"],
          target: k.get("m")["properties"]["uid"],
        };
      });

      const links = Object.values(rel_info);
      /** 构造3D-Graph数据的节点 */
      const nodes = Object.entries(node_info).map((entry) => {
        return { id: entry[0], labels: entry[1].labels, attrs: entry[1].attrs };
      });

      this.myGraph.graphData({
        nodes: nodes,
        links: links,
      });
    },
    showNode(node) {
      ElNotification({
        title: null,
        duration: 20000,
        message: h("p", null, [
          h(
            "ul",
            {
              class: "test-ul",
            },
            [
              h("span", { class: "label" }, "缺陷类型："),
              h("span", {}, node && node["attrs"].defect),
            ]
          ),
          h(
            "ul",
            {
              class: "test-ul",
            },
            [
              h("span", { class: "label" }, "缺陷原因："),
              h("span", {}, node && node["attrs"].reason),
            ]
          ),
          h(
            "ul",
            {
              class: "test-ul",
            },
            [
              h("span", { class: "label" }, "缺陷设备："),
              h("span", {}, node && node["attrs"].device),
              // node && node["attrs"].name
            ]
          ),
          h(
            "ul",
            {
              class: "test-ul",
            },
            [
              h("span", { class: "label" }, "解决方法："),
              h("span", {}, node && node["attrs"].method),
            ]
          ),
          h(
            "ul",
            {
              class: "test-ul",
            },
            [
              h("span", { class: "label" }, "缺陷描述："),
              h("span", {}, node && node["attrs"].data),
            ]
          ),
          h(
            "ul",
            {
              class: "test-ul",
            },
            [
              h("span", { class: "label" }, "消缺说明："),
              h("span", {}, node && node["attrs"].solution),
            ]
          ),
          // h(
          //   "ul",
          //   {
          //     class: "test-ul",
          //   },
          //   node && node["attrs"].data
          // ),
        ]),
      });
    },
    //获取统计数据
    async getStatistic() {
      const session = this.driver.session();
      const nodeNum = await session.run("MATCH (n) RETURN count(*)");
      const linkNum = await session.run(
        "MATCH (n)-[r]-() RETURN count(distinct r)"
      );
      try {
        console.log(
          nodeNum.records[0].get("count(*)")["low"],
          linkNum.records[0].get("count(distinct r)")["low"]
        );
        this.nodeNum = nodeNum.records[0].get("count(*)")["low"];
        this.linkNum = linkNum.records[0].get("count(distinct r)")["low"];
      } catch (error) {}
    },
    async calculateDegrees(str){
      const session = this.driver.session();
      const result = await session.run(
        "match (n) WHERE n.device='光缆' return size([p = (n)-[]->() | p]) as s,n  order by s desc LIMIT 3" 
      );

//       MATCH(a)
// WHERE a.name = '重启'
// RETURN size([p = (a)-- > ()-- > () | p]) AS fof

      console.log('result', result)
    }
  },
};
</script>

<template>
  <h3 id="title">自动化设备知识图谱</h3>
   <div class="retract-btn" :class="{
    retractReverse:close
   }"  @click="close=!close">
      </div>
  <el-card class="box-card " :class="{
    closeCard:close
  }">
   
    <!-- <el-button size="small" plain type="success">Success</el-button> -->
    <h6>标签:({{ this.nodeNum }}个)</h6>
    <el-divider :style="{ borderTop: '1px dashed #07d6ff' }" />
    <el-tag class="ml-2" @click="searchNode('', pageNum)" type="info">全部</el-tag>
    <el-tag class="ml-2" @click="searchNode('原因', pageNum)" 
      >原因</el-tag
    >
    <el-tag class="ml-2" @click="searchNode('方法', pageNum)" type="success"
      >方法</el-tag
    >
    <el-tag class="ml-2" @click="searchNode('缺陷', pageNum)" type="warning"
      >缺陷</el-tag
    >
    <el-tag class="ml-2" @click="searchNode('设备', pageNum)" type="danger"
      >设备</el-tag
    >

    <div class="search">
      <span>节点名称：</span>
      <!-- <el-input
        v-model="nodeName"
        placeholder="请输入节点名称"
        class="input-with-select"
        size="small"
      >
        <template #append>
          <el-button :icon="Search" />
        </template>
      </el-input> -->

      <el-input
        v-model="nodeName"
        class="w-50 m-2"
        placeholder="请输入节点名称"
        size="small"
      />
      <el-button
        @click="fuzzySearchNode(nodeName, pageNum)"
        type="primary"
        size="small"
        round
        >查询</el-button
      >


      <!-- <el-button
          @click="calculateDegrees(nodeName)"
          type="primary"
          size="small"
          round
          >计算出度</el-button
        > -->
    </div>
  </el-card>
  <div class="retract-btn1" :class="{
    retractReverse:close1
  }"  @click="close1 = !close1">
        </div>
  <el-card class="box-card1 box-card" :class="{
    closeCard: close1
  }">
    
    <!-- <el-button size="small" plain type="success">Success</el-button> -->
    <h6>关联关系:({{ this.linkNum }}个)</h6>
    <el-divider :style="{ borderTop: '1px dashed #07d6ff' }" />
    <el-tag class="ml-2" @click="searchAllLink(5000)" type="info">全部</el-tag>
    <el-tag
      class="ml-2"
      @click="searchOneKindLink('故障原因', pageNum)"
      >故障原因</el-tag
    >
    <el-tag
      class="ml-2"
      @click="searchOneKindLink('缺陷设备', pageNum)"
      type="warning"
      >缺陷设备</el-tag
    >
    <el-tag
      class="ml-2"
      @click="searchOneKindLink('解决方案', pageNum)"
      
      type="success"
      >解决方案</el-tag
    >
    <div class="search">
      <div>
        <div>
          <span>首节点：</span>
          <el-input
            v-model="startNode"
            class="w-50 m-2"
            placeholder="请输入节点名称"
            size="small"
          />
        </div>
        <div class="node-input">
          <span>尾节点：</span>
          <el-input
            v-model="endNode"
            class="w-50 m-2"
            placeholder="请输入节点名称"
            size="small"
          />
        </div>
      </div>
      <el-button
        @click="searchDeepLink(startNode, endNode, pageNum)"
        type="primary"
        size="small"
        round
        >查询</el-button
      >
    </div>
  </el-card>
  <div class="retract-btn2" :class="{
    retractReverse:close2
  }"  @click="close2 =!close2">
          </div>
  <el-card class="box-card2 box-card" :class="{
    closeCard: close2
  }">
    
    <h6>专业分类</h6>
      <el-divider :style="{ borderTop: '1px dashed #07d6ff' }" />
    <div class="major">
      <el-tag class="ml-2" @click="searchMajorLink('安防', pageNum)" type="success"
        >安防</el-tag
      >
      <el-tag class="ml-2" @click="searchMajorLink('远动', pageNum)" type="info"
        >远动</el-tag
      >
      <el-tag class="ml-2" @click="searchMajorLink('专网', pageNum)" 
        >专网</el-tag
      >
      <el-tag class="ml-2" @click="searchMajorLink('PMU', pageNum)" type="warning"
          >PMU</el-tag
        >
    </div>
    <div class="search">
      <div>布局方式：</div>
      <el-select
        v-model="layoutType"
        class="m-2"
        :style="{
          width: '100px',
        }"
        placeholder="Select"
        size="small"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <div>
        <el-select
          v-model="pageNum"
          class="m-2"
          :style="{
            width: '90px',
            marginLeft: '10px',
          }"
          placeholder="Select"
          size="small"
        >
          <el-option
            v-for="item in pageOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
    </div>
  </el-card>

  <div id="graph"></div>
</template>

<style lang="less" scoped>
h6 {
  color: #fff;
  font-size: 18px;
}
.ml-2 {
  cursor: pointer;
}
#title {
  position: absolute;
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
.box-card {
  position: absolute;
  z-index: 10;
  left: 50px;
  top: 60px;
  width: 320px;
  height: 200px;
  overflow:hidden;
  background-color: rgba(0, 0, 0, 0.2);
  border-color: #07d6ff;
  backdrop-filter: blur(6px);
  opacity: 1;
  padding: 5px;
  transition: all 1.0s; 
}
.closeCard {
  left: -400px;
  opacity: 0;
  transition: all 1.0s; 
}
// .box-card::before, .box-card::after {
//     content: "";
//     position: absolute;
//     top: -2px;
//     left: -2px;
//     right: -2px;
//     bottom: -2px;
//     border: 1px dashed #07d6ff;
//     transition: all 1.2s;
//     border-radius: 5px;
//     animation: clippath 10s infinite linear;
// }
// .box-card::after {
//     animation: clippath 10s infinite -3.5s linear;
// }
// @keyframes clippath {
//     0%, 100% { clip-path: inset(0 0 98% 0); }
//     25% { clip-path: inset(0 98% 0 0); }
//     50% { clip-path: inset(98% 0 0 0); }
//     75% { clip-path: inset(0 0 0 98%); }
// }
.box-card1 {
  top: 280px;
}
.box-card2 {
  top: 500px;
  height: 200px;
}
.read-the-docs {
  color: #888;
}
#graph {
  background-color: black;
  background-image: url("/bg.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.search {
  position: absolute;
  bottom: 25px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
  color: #fff;
  font-size: 12px;
  font-weight: 500;
}
.node-input {
  margin-top: 5px;
}
.test-ul {
  font-size: 10px;
  color: #fff;
}
.retract-btn {
    position: fixed;
    display: inline-block;
    top: 150px;
    left: 30px;
    transform: rotate(180deg);
    background-color: transparent;
    background-image: url(/src/assets/retract.png);
    background-size: 100% 100%;
    background-repeat: no-repeat;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    inset-inline-end: 24px;
    inset-block-end: 48px;
    z-index: 12;
    transition: all 0.3s ease-in-out;
    cursor: pointer;
    box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
}
.retract-btn1 {
  .retract-btn;
  top:370px;
}
.retract-btn2 {
  .retract-btn;
  top:580px;
}
.retractReverse {
  transform: rotate(0deg);
  transition: all 0.3s ease-in-out;
}

</style>
