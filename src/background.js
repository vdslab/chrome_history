const nodes = [];
const links = [];
const nodeIDs = [];

chrome.history.onVisited.addListener((re) => {
  if (!nodeIDs.includes(re.id)) {
    nodes.push({ data: { id: re.id, url: re.url } });
    nodeIDs.push(re.id);
  }

  if (nodeIDs.length !== 1) {
    links.push({
      data: { target: re.id, source: nodeIDs[nodeIDs.length - 2] },
    });
  }
});
