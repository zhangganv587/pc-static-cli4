import helpData from "./data";

// 获取展开的 keys
const searchHelpWrap = (helpData) => (keywords) => {
  if (!keywords) {
    return helpData;
  }

  if (!Array.isArray(helpData)) {
    return "";
  }

  return helpData.reduce((results, help) => {
    if (help.title.includes(keywords)) {
      results.push(help.key);
    }

    return results;
  }, []);
};

export default helpData;

export const searchKeys = searchHelpWrap(helpData);
