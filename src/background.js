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
    const alreadyParent =
      family.some(({ data: { parent } }) => re.id === parent) &&
      links.length != 1;

    const isChild2Child = family.some(({ data: { children } }) => {
      return children.some((id) => id === re.id);
    });

    const isBack = alreadyParent || isChild2Child;

    links.push({
      data: {
        target: re.id,
        source: nodeIDs[nodeIDs.length - 2],
        isBack,
      },
    });

    const foundindex = family.findIndex(
      (element) => element.data.parent === nodeIDs[nodeIDs.length - 2]
    );
    if (foundindex !== -1) {
      const newChild = [
        ...new Set([...family[foundindex].data.children, re.id]),
      ];
      family[foundindex].data.children = newChild;
    } else if (!alreadyParent) {
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

    // chrome.runtime.sendMessage("ready-post-data", (response) => {
    //   return true;
    // });
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message === "get-data") {
    sendResponse({ nodes, links, family });
  } else {
    sendResponse(`no responce: ${message}`);
  }
  return true;
});

let lifeline;

//5分間の再接続処理
chrome.runtime.onConnect.addListener((port) => {
  console.log("connect");
  if (port.name === "keepAlive") {
    lifeline = port;
    setTimeout(keepAliveForced, 295e3); //4分55秒
    port.onDisconnect.addListener(keepAliveForced);
  }
});

function keepAliveForced() {
  lifeline?.disconnect();
  lifeline = null;
  keepAlive();
}

async function keepAlive() {
  if (lifeline) return;
  chrome.runtime.connect({ name: "keepAlive" });
}
