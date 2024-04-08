// 先載入 http 模組
const http = require("http");
const { v4: uuidv4 } = require("uuid");
const errorHandle = require("./errorHandle");

const todos = [];

// 建立一個 request 監聽函式
const requestHandler = (request, response) => {
  // 建立 response 的表頭內容
  const Headers = {
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, Content-Length, X-Requested-With",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "PATCH, POST, GET,OPTIONS,DELETE",
    "Content-Type": "application/json",
  };

  let body = "";
  request.on("data", chunk => {
    body += chunk;
  });
  if (request.url === "/todos" && request.method === "GET") {
    response.writeHead(200, Headers);
    response.write(
      JSON.stringify({
        status: 200,
        data: todos,
      })
    );
    response.end();
  } else if (request.url === "/todos" && request.method === "POST") {
    request.on("end", () => {
      try {
        const title = JSON.parse(body).title;
        if (title !== undefined) {
          const todo = {
            title,
            id: uuidv4(),
          };
          todos.push(todo);
          response.writeHead(200, Headers);
          response.write(
            JSON.stringify({
              status: "success",
              data: todos,
            })
          );
          response.end();
        } else {
          errorHandle(response);
        }
      } catch (error) {
        errorHandle(response);
      }
    });
  } else if (request.url === "/todos" && request.method === "DELETE") {
    // 清空所有待辦事項
    todos.length = 0;

    response.writeHead(200, Headers);
    response.write(
      JSON.stringify({
        status: "success",
        data: todos,
      })
    );
    response.end();
  } else if (request.url.startsWith("/todos/") && request.method === "DELETE") {
    // 把 id 提取出來
    const id = request.url.split("/").pop();

    //比對此 id 是否存在
    const index = todos.findIndex(todo => todo.id === id);

    if (index !== -1) {
      // 刪除指定資料
      todos.splice(index, 1);
      response.writeHead(200, Headers);
      response.write(
        JSON.stringify({
          status: "success",
          data: todos,
        })
      );
      response.end();
    } else {
      errorHandle(response);
    }
  } else if (request.url.startsWith("/todos/") && request.method === "PATCH") {
    request.on("end", () => {
      try {
        const todo = JSON.parse(body).title;
        const id = request.url.split("/").pop();
        const index = todos.findIndex(todo => todo.id === id);
        if (todo !== undefined && index !== -1) {
          todos[index].title = todo;
          response.writeHead(200, Headers);
          response.write(
            JSON.stringify({
              status: 200,
              data: todos,
            })
          );
          response.end();
        } else {
          errorHandle(response);
        }
      } catch (err) {
        errorHandle(response);
      }
    });
  } else if (request.method === "OPTIONS") {
    response.writeHead(200, Headers);
    response.end();
  } else {
    response.writeHead(404, Headers);
    response.write(
      JSON.stringify({
        status: false,
        message: "無此網路路由",
      })
    );
    response.end();
  }
};

// 將 request 監聽函式與 port 8080 進行連結
const server = http.createServer(requestHandler);
server.listen(8080);
