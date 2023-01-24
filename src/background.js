const nodes = [];
const links = [];
const nodeIDs = [];
const noderelative = [];
const family = [];

chrome.history.onVisited.addListener((re) => {
  if (!nodeIDs.includes(re.id)) {
    nodes.push({ data: { id: re.id, url: re.url, title: re.title } });
  }
  nodeIDs.push(re.id);

  if (nodeIDs.length !== 1) {
    links.push({
      data: { target: re.id, source: nodeIDs[nodeIDs.length - 2] },
    });

    const foundindex = family.findIndex(
      (element) => element.data.parent === nodeIDs[nodeIDs.length - 2]
    );
    if (foundindex !== -1) {
      family[foundindex].data.children.push(re.id);
    } else {
      family.push({
        data: { children: [re.id], parent: nodeIDs[nodeIDs.length - 2] },
      });
    }

    if (
      nodeIDs.length >= 3 &&
      nodeIDs[nodeIDs.length - 1] === nodeIDs[nodeIDs.length - 3]
    ) {
      links[links.length - 1].data.back = true;
      nodeIDs.pop();
      nodeIDs.pop();
    } else {
      links[links.length - 1].data.back = false;
    }

    chrome.runtime.sendMessage("ready-post-data", (response) => {
      // console.log("received ", response);
    });
  }
  // console.log(nodeIDs);
  // console.log(links);
  console.log(family);

  // if(nodeIDs.lingth === 1){
  //   noderelative.push({parent:re.id, children:0})
  // }else{
  //   noderelative.push({parent:nodeIDs[nodeIDs.length-2], children:re.id})
  // }
});

chrome.history.onVisitRemoved.addListener((item) => { });

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message === "get-data") {
    sendResponse({ nodes, links, family });
  } else {
    sendResponse(`no responce: ${message}`);
  }
});
