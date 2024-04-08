function errorHandle(response) {
  const Headers = {
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, Content-Length, X-Requested-With",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "PATCH, POST, GET,OPTIONS,DELETE",
    "Content-Type": "application/json",
  };
  response.writeHead(400, Headers);
  response.write(
    JSON.stringify({
      status: "false",
      message: "資料格式不正確 or id 不存在",
    })
  );
  response.end();
}

module.exports = errorHandle;
