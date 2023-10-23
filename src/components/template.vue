<template>
  <h3 id="title">故障信息自动填报</h3>
  <div id="graph"></div>
  <div id="form">
    <el-form  :model="form" label-width="120px">
        <el-form-item label="缺陷描述">
          <el-input v-model="form.name" type="textarea" />
        </el-form-item>
        <el-form-item label="缺陷设备" width="100%">
          <el-input v-model="form.device" type="textarea" />
        </el-form-item>
        <el-form-item label="缺陷类型">
          <el-input v-model="form.type" type="textarea" />
        </el-form-item>
        <el-form-item label="缺陷原因">
          <el-input v-model="form.reason" type="textarea" />
        </el-form-item>
        <el-form-item label="缺陷解决方法">
          <el-input v-model="form.method" type="textarea" />
        </el-form-item>
        <el-form-item  class="btnContainer"  >
          <div class="btns" >
            <el-button type="primary" @click="onSubmit">提交</el-button>
            <el-button @click="recommendFn"  >推荐</el-button>
          </div>
        </el-form-item>
      </el-form>
  </div>
</template>
<script  >
import ForceGraph from "force-graph";
import neo4j from "neo4j-driver";
import { ElNotification } from "element-plus";


export default {
  name: "recommend",
  data() {
    return {
      driver: null,
      myGraph: null, // 3D-graph对象
      graphData: null, // 3D-graph加载的图数据
      db: {
        // 数据库连接配置：
        uri: "neo4j://localhost", // 		neo4j地址（不给端口默认7687）
        // uri : "http://127.0.0.1:7687",  // 		neo4j地址（不给端口默认7687）
        user: "neo4j", // 		数据库用户名(默认neo4j，修改成自己的)
        password: "@Mutong@1214", // 		数据库密码（默认ne4oj，修改成自己的）
      },
      form:{
        name: '',
        device: '',
        type: '',
        reason: '',
        method: "",
      }
    };
  },
  mounted() {
    const elem = document.getElementById("graph");
    const Graph = ForceGraph()(elem);
    this.myGraph = Graph;
    this.driver = neo4j.driver(
      this.db.uri,
      neo4j.auth.basic(this.db.user, this.db.password)
    );
  },
  methods: {
    async getCyperResult(str) {
      const session = this.driver.session();
      const result = await session.run(
        "CALL db.index.fulltext.queryNodes('defectDataIndex', 'data: "+str+"') " + 
        "YIELD node, score "+
        "RETURN node, score"+
        " LIMIT 5",
      );
      if(!result.records[0]){
        ElNotification({
          message: "未匹配到数据",
        })
        return;
      }
      let data = result.records[0]?.get('node').properties;
      console.log('result', result.records[0].get('node').properties)
      this.form = {
        ...this.form,
        reason:data.reason,
        device:data.device,
        type:data.defect,
        method:data.method
      }
    },
    async recommendFn(){
      this.getCyperResult(this.form.name)
    },
    async onSubmit(){
        let id = this.uuid();
        const { reason,device,type,method,name } = this.form;
        await this.driver.executeQuery('CREATE (p:缺陷 { name: $name,device: $device, defect: $defect, reason: $reason, method: $method,uid:$uid,data:$desc,solution:$solution,major:$major }) RETURN p', { name: name, device: device || "", defect: type || "", reason: reason || "", method: method || "", uid: id, desc: name || "", solution: method || "", major:  "" });


        ElNotification({
          message: "提交成功！",
        })
        this.form = {
          name: '',
          device: '',
          type: '',
          reason: '',
          method: "",
        }
    },
    uuid() {
      var s = [];
      var hexDigits = "0123456789abcdef";
      for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
      }
      s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
      s[8] = s[13] = s[18] = s[23] = "-";

      var uuid = s.join("");
      return uuid;
    }
  },
};
</script>


<style lang="less" scoped>
h6 {
  color: #fff;
}
#form {
  position: absolute;
  top: 100px;
  left: 50%;
  width: 600px;
  padding: 30px 30px 30px 0;
  transform: translateX(-50%);
  color: #fff;
  font-weight: 500;
  box-shadow: 30px 30px 30px 0 rgba(0, 0, 0, 0.5);
  border-radius: 15px;
  border: 1px solid #007272;
  background: radial-gradient(82.37% 81.55% at 0 0,rgba(0,114,114,.2) 0,transparent 100%),rgba(8,4,32,.2);
  backdrop-filter: blur(5px)
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

#graph {
  background-color: black;
  background-image: url("/bg.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
}


.btns {
  display: flex;
  justify-content: space-between;
}
</style>
