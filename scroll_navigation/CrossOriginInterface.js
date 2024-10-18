function scroll(anchorId) {
    const element = document.getElementById(anchorId);
    console.log('Scrolling to', anchorId); 
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' , block: 'start'});
    }
}

//Anchors are sorted in the order they appear in the document
const sortedAnchors = [];
const trackedAnchors = new Set();
const anchorVisibleStates = {}
let activeAnchorId = null;

function checkBestAnchor(){
    if (activeAnchorId) {
        if (anchorVisibleStates[activeAnchorId]) {
            return;
        }
        let newActiveAnchorId = null;

        const activeAnchorIndex = sortedAnchors.indexOf(activeAnchorId);

        // If anchor dissapeared above screen, find the next anchor below that is visible. 
        for (let i = activeAnchorIndex + 1; i < sortedAnchors.length; i++) {
            const anchorId = sortedAnchors[i];
            if (anchorVisibleStates[anchorId]) {
                newActiveAnchorId = anchorId;
                break;
            }
        }
        if (newActiveAnchorId === null) {
            // If anchor dissapeared below screen, find the next anchor above that is visible.
            for (let i = activeAnchorIndex - 1; i >= 0; i--) {
                const anchorId = sortedAnchors[i];
                if (anchorVisibleStates[anchorId]) {
                    newActiveAnchorId = anchorId;
                    break;
                }
            }
        }
        console.log("flag1")
        if (newActiveAnchorId !== null) {
            activeAnchorId = newActiveAnchorId;
            // Send a message to iframe to update the active anchor
            postMessageToClients({ method: 'updateActiveAnchor', anchor_id: activeAnchorId });
            console.log('Sent new active anchor', activeAnchorId);
        }
    }
}

function postMessageToClients(message) {
    clients.forEach(client => {
        client.postMessage(message, "*");
    });
}

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const anchorId = entry.target.id;
        if (entry.isIntersecting) {
            anchorVisibleStates[anchorId] = true;
        } else {
            anchorVisibleStates[anchorId] = false;
            // If the invisible anchor is the active anchor, find a new active anchor
            if (activeAnchorId === anchorId) {
                checkBestAnchor();
            }
        }
    });
}, { threshold: [0, 1] });

function trackAnchor(anchorId) {
    if (trackedAnchors.has(anchorId)) {
        console.log('Anchor is already being tracked', anchorId);
        return;
    }
    
    const anchor = document.getElementById(anchorId);

    if (!anchor) {
        console.error('Anchor does not exist', anchorId);
        return
    }
    trackedAnchors.add(anchorId);

    //Insert anchor into sortedAnchors based on its position in the document
    let inserted = false;
    for (let i = 0; i < sortedAnchors.length; i++) {
        const currentAnchor = document.getElementBy(    if (!anchor) {tPosition(currentAnchor) & Node.DOCUMENT_POSITION_FOLLOWING) {
            sortedAnchors.splice(i, 0, anchorId);
            inserted = true;
            break;
        }
    }
    if (!inserted) {
        sortedAnchors.push(anchorId);
    }
    
    observer.observe(anchor);
    console.log('Started tracking anchor', anchorId);
}

let updateActiveAnchorAcc = 0;
function updateActiveAnchor(anchor_id) {
    activeAnchorId = anchor_id;
}

const clients = [];

window.addEventListener("message", (event) => {
    const { method } = event.data;
    //If method is undefined, it is not a message from the iframe
    if (!method) {
        return;
    }

    if (method === 'scroll') {
        const { anchor_id } = event.data;
        scroll(anchor_id);
    }
    else if (method === 'register') {
        clients.push(event.source);
    }
    else if (method === 'trackAnchors') {
        const { anchor_ids } = event.data;
        anchor_ids.forEach(trackAnchor);
    }
    else if (method === 'updateActiveAnchor') {
        const { anchor_id } = event.data;
        updateActiveAnchor(anchor_id);
    }
    else {
        console.error('Unknown method', method);
    }
});
