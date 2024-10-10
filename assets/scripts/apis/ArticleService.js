import URLS from "../constants/url.js";

const getData = async (fetchFunction) => {
  const data = await fetchFunction()
    .then((response) => {
      if (response.status >= 300 || response.status < 200) {
        if (response.status === 404) throw new Error("게시글을 찾을 수 없음");
        throw new Error("에러가 발생했습니다.");
      }
      return response.json();
    })
    .catch((e) => console.log(e.message));
  return data;
};

export const getArticleList = async (page = 1, pageSize = 100, keyword = "") => {
  const URL = `${URLS.articles}?page=${page}&pageSize=${pageSize}&keyword=${keyword}`;
  const data = getData(async () => await fetch(URL));
  return data;
};

export const getArticle = async (id = 0) => {
  const URL = `${URLS.articles}/${id}`;
  const data = getData(async () => await fetch(URL));
  return data;
};
