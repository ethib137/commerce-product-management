export const fetch = (url, options = {}) => {
  const contentType = options.contentType || "application/json";
  const data = options.data || {};
  const method = options.method || "GET";

  const request = {
    method,
  };

  if (method === "POST" || method === "PUT" || method === "DELETE") {
    if (contentType === "application/json") {
      request.body = JSON.stringify(data);

      const headers = new Headers();

      headers.append("Content-Type", contentType);

      request.headers = headers;
    } else if (contentType === "multipart/form-data") {
      const formData = new FormData();

      for (const name in data) {
        formData.append(name, data[name]);
      }

      request.body = formData;
    }
  }

  let okay = true;

  return Liferay.Util.fetch(url, request)
    .then((res) => {
      okay = res.ok;

      if (okay) {
        return res.json();
      } else {
        return res.text();
      }
    })
    .then((res) => {
      return res;
    });
};
