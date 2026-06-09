const http = require("http");

const server = require("./server");
const PORT = process.env.PORT || 3000;

setTimeout(() => {
  http.get(`http://localhost:${PORT}/`, (res) => {
    if (res.statusCode === 200) {
      console.log("✅ Test passed");
      process.exit(0);
    } else {
      console.log("❌ Test failed");
      process.exit(1);
    }
  });
}, 1000);