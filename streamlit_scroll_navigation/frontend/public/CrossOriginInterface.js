//Source for CrossOriginInterface class.
//Build with terser:
//  npx terser ./src/CrossOriginInterface.js --compress --mangle 'pure_funcs=["console.debug"]' --output frontend/build/CrossOriginInterface.min.js
class CrossOriginInterface {
    static instances = {};
    constructor(key) {

        if (CrossOriginInterface.instances[key]) {
            console.error('CrossOriginInterface instance already exists with key', key);
            return CrossOriginInterface.instances[key];
        }
        CrossOriginInterface.instances[key] = this;
        this.sortedAnchors = [];
        this.trackedAnchors = new Set();
        this.anchorVisibleStates = {};
        this.activeAnchorId = null;
        this.component = null;
        this.autoUpdateAnchor = false;
        this.key = key;
        window.addEventListener("message", this.handleMessage.bind(this));
    }

    register(component, autoUpdateAnchor)     {
        this.component = component;
        this.autoUpdateAnchor = autoUpdateAnchor;
        console.debug('Registered component', component, autoUpdateAnchor);
    }
    scroll(anchorId) {
        const element = document.getElementById(anchorId);
        console.debug('Scrolling to', anchorId); 
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' , block: 'start'});
        }
        this.emphasize(anchorId);
    }
    emphasize(anchorId) {
        const element = document.getElementById(anchorId);
        if (element) {    
            // Apply .4s pop effect with a .1s delay
            element.style.transition = 'transform 0.4s ease-in-out 0.1s';
            element.style.transform = 'scale(1.04)';  // Scale up the element
            // Remove the effect after the animation completes
            setTimeout(() => {
                element.style.transform = 'scale(1)';  // Return to original size
            }, 600);
        }
    }

    updateActiveAnchor(anchorId) {
        if (this.trackedAnchors.has(anchorId)) {
            this.activeAnchorId = anchorId;
            console.debug('Updated active anchor', anchorId);
        }
        else {
            console.error('Anchor is not being tracked', anchorId ?? 'null');
        }
    }

    checkBestAnchor(){
        if (this.activeAnchorId) {
            //Check if active anchor is visible, if not we need a new active anchor
            if (this.anchorVisibleStates[this.activeAnchorId]) {
                return;
            }

            //Search sorted anchors closest to the current active anchor for first visible
            let newActiveAnchorId = null;
            const activeAnchorIndex = this.sortedAnchors.indexOf(this.activeAnchorId);
            // If anchor dissapeared above screen, find the next anchor below that is visible. 
            for (let i = activeAnchorIndex + 1; i < this.sortedAnchors.length; i++) {
                const anchorId = this.sortedAnchors[i];
                if (this.anchorVisibleStates[anchorId]) {
                    newActiveAnchorId = anchorId;
                    break;
                }
            }
            if (newActiveAnchorId === null) {
                // If anchor dissapeared below screen, find the next anchor above that is visible.
                for (let i = activeAnchorIndex - 1; i >= 0; i--) {
                    const anchorId = this.sortedAnchors[i];
                    if (this.anchorVisibleStates[anchorId]) {
                        newActiveAnchorId = anchorId;
                        break;
                    }
                }
            }
            
            //If new anchor found, update the component's active anchor
            if (newActiveAnchorId !== null) {
                this.activeAnchorId = newActiveAnchorId;
                this.postMessage('updateActiveAnchor', this.activeAnchorId);
                console.debug('Sent new active anchor', this.activeAnchorId);
            }
        }
    }

    postMessage(COMPONENT_method, anchor_id) {
        if (this.component === null) {
            console.error('Component has not been registered');
            return;
        }
        this.component.postMessage({ COMPONENT_method: COMPONENT_method, key: this.key, anchor_id }, '*');
    }

    observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const anchorId = entry.target.id;
            if (entry.isIntersecting) {
                this.anchorVisibleStates[anchorId] = true;
            } else {
                this.anchorVisibleStates[anchorId] = false;
                // If the invisible anchor is the active anchor, find a new active anchor
                if (this.activeAnchorId === anchorId) {
                    this.checkBestAnchor();
                }
            }
        });
    }, { threshold: [0, 1] });

    trackAnchors(anchor_ids) {
        for (const anchorId of anchor_ids) {
            if (this.trackedAnchors.has(anchorId)) {
                console.debug('Anchor is already being tracked', anchorId);
                return;
            }
            
            const anchor = document.getElementById(anchorId);

            if (!anchor) {
                console.error('Anchor does not exist', anchorId);
                return
            }
            this.trackedAnchors.add(anchorId);

            //Insert anchor into sortedAnchors based on its position in the document
            let inserted = false;
            for (let i = 0; i < this.sortedAnchors.length; i++) {
                const currentAnchor = document.getElementById(this.sortedAnchors[i]);
                if (anchor.compareDocumentPosition(currentAnchor) & Node.DOCUMENT_POSITION_FOLLOWING) {
                    this.sortedAnchors.splice(i, 0, anchorId);
                    inserted = true;
                    break;
                }
            }
            if (!inserted) {
                this.sortedAnchors.push(anchorId);
            }
            this.sortedAnchors.push(anchorId);
            
            this.observer.observe(anchor);
            console.debug('Started tracking anchor', anchorId);
        }
    }
        
    handleMessage(event) {
        const { COI_method, key} = event.data;
        
        //Check if message is intended for COI
        if (!COI_method || !key) {
            return;
        }
        //Check if message is intended for this COI instance
        if (key !== this.key) {
            return;
        }
        console.debug("COI with key", key, "received message", event.data);
        
        //If component is not registered, only allow registration method
        if (this.component === null) {
            if (COI_method === 'register') {
                const {auto_update_anchor} = event.data;
                this.register(event.source, auto_update_anchor);
            }
            else {
                console.error('Must register component with this CrossOriginInterface before calling other methods');
            }
        }

        switch (COI_method) {
            case 'scroll':
                const { anchor_id: scrollAnchorId } = event.data;
                this.scroll(scrollAnchorId);
                break;
            case 'register':
                console.debug('Register can only be called once per key.');
                break;
            case 'trackAnchors':
                const { anchor_ids } = event.data;
                this.trackAnchors(anchor_ids);
                break;
            case 'updateActiveAnchor':
                const { anchor_id: updateAnchorId } = event.data;
                this.updateActiveAnchor(updateAnchorId);
            break;
                default:
                console.error('Unknown method', COI_method);
        }
    }
}
function instantiateCrossOriginInterface(key) {
    return new CrossOriginInterface(key);
}