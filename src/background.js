const nodes = [];
const links = [];
const nodeIDs = [];
<<<<<<< HEAD
const noderelative = [];
=======
>>>>>>> 03e12d218f0bea9eba77447074d557be9d625814

chrome.history.onVisited.addListener((re) => {
  if (!nodeIDs.includes(re.id)) {
    nodes.push({ data: { id: re.id, url: re.url } });
<<<<<<< HEAD
  }
  nodeIDs.push(re.id);
=======
    nodeIDs.push(re.id);
  }
>>>>>>> 03e12d218f0bea9eba77447074d557be9d625814

  if (nodeIDs.length !== 1) {
    links.push({
      data: { target: re.id, source: nodeIDs[nodeIDs.length - 2] },
    });
<<<<<<< HEAD

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

=======
>>>>>>> 03e12d218f0bea9eba77447074d557be9d625814
    chrome.runtime.sendMessage("ready-post-data", (response) => {
      // console.log("received ", response);
    });
  }
<<<<<<< HEAD
  console.log(nodeIDs);
  console.log(links);

  // if(nodeIDs.lingth === 1){
  //   noderelative.push({parent:re.id, children:0})
  // }else{
  //   noderelative.push({parent:nodeIDs[nodeIDs.length-2], children:re.id})
  // }
});

chrome.history.onVisitRemoved.addListener((item) => {});
=======
});

chrome.history.onVisitRemoved.addListener((item) => {
  console.log("remove", item);
});
>>>>>>> 03e12d218f0bea9eba77447074d557be9d625814

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message === "get-data") {
    sendResponse({ nodes, links });
  } else {
    sendResponse(`no responce: ${message}`);
  }
});
