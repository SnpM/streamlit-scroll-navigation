  import {
    Streamlit,
    StreamlitComponentBase,
    withStreamlitConnection,
  } from "streamlit-component-lib";
  import React, { ReactNode } from "react";
  import "bootstrap-icons/font/bootstrap-icons.css";

  interface State {
    activeAnchorId: string;
  }





  class SidebarMenu extends StreamlitComponentBase<State> {

    public state = { activeAnchorId: "" }; 

    postMessage(COI_method:string, data?:{anchor_id?:string, anchor_ids?:string[]}) {
      const {key} = this.props.args;
      if (key == null || typeof key !== "string") {
        throw new Error("Invalid key: key must be a string.");
      }

      const {anchor_id, anchor_ids} = data || {};
      window.parent.postMessage({ COI_method, key, anchor_id, anchor_ids }, "*");
    }
    
    postScroll(anchor_id: string): void {
      this.postMessage("scroll", {anchor_id});
      console.log("postScroll", anchor_id);
    }
    postRegister(): void {
      this.postMessage("register");
    }
    postTrackAnchors(anchor_ids:string[]): void {
      this.postMessage("trackAnchors", {anchor_ids});
    }
    postUpdateActiveAnchor(anchor_id:string): void {
      this.postMessage("updateActiveAnchor", {anchor_id});
    }

    // Handle menu item click
    private handleMenuClick = (anchorId: string) => {
      this.setState({ activeAnchorId: anchorId });
      this.postScroll(anchorId);
      this.postUpdateActiveAnchor(anchorId);
      Streamlit.setComponentValue(anchorId);
    };

    public componentDidMount(): void {
      const { anchor_ids } = this.getCleanedArgs();
      this.postRegister();
      this.postTrackAnchors(anchor_ids);

      this.setState({ activeAnchorId: anchor_ids[0] });
      this.postUpdateActiveAnchor(anchor_ids[0]);
      window.addEventListener("message", this.handleMessage.bind(this));
    }

    componentDidUpdate(): void {
      super.componentDidUpdate();
      const { anchor_ids, force_anchor } = this.getCleanedArgs();
        if (force_anchor != undefined) {
          if (anchor_ids.includes(force_anchor)) {
          this.handleMenuClick(force_anchor);
        }
        else {
          throw new Error("Invalid force_anchor: force_anchor must be one of the anchor_ids.");
        }
      }
    }
   

    private handleMessage(event: MessageEvent) {
      const {COMPONENT_method, key} = event.data;
      if (COMPONENT_method == null || key == null) {
        return;
      }
      if (key !== this.props.args.key) {
        return;
      }

      console.log("handleMessage", event.data);
      if (COMPONENT_method === "updateActiveAnchor") {
        const { anchor_id } = event.data;
        if (anchor_id && typeof anchor_id === "string") {
          this.setState({ activeAnchorId: anchor_id });
        }
      }
    }

    private getCleanedArgs() {
      let { anchor_ids, anchor_labels, anchor_icons, force_anchor, key} = this.props.args;

      // anchor_ids is required
      if (anchor_ids == null || !Array.isArray(anchor_ids) || !anchor_ids.every((a) => typeof a === "string")) {
        throw new Error("Invalid anchors: anchors must be a list of strings.");
      }

      //key is required
      if (key == null || typeof key !== "string") {
        throw new Error("Invalid key: key must be a string.");
      }

      // anchor_labels is an optional list
      if (anchor_labels == null) {
        anchor_labels = anchor_ids;
      }
      else {
        if (!Array.isArray(anchor_labels) || !anchor_labels.every((a) => typeof a === "string")) {
          throw new Error("Invalid anchor_labels: anchor_labels must be a list of strings.");
        }
      }

      // anchor_icons is an optional list
      if (anchor_icons == null) {
        // List of null icons
        anchor_icons = new Array(anchor_ids.length).fill(null);
      }
      else {
        if ((!Array.isArray(anchor_icons) || !anchor_icons.every((a) => typeof a === "string"))) {
          throw new Error("Invalid anchor_icons: anchor_icons must be a list of strings.");
        }
      }

      // force_anchor is an optional string
      if (force_anchor != null && typeof force_anchor !== "string") {
        throw new Error("Invalid force_anchor: force_anchor must be a string.");
      }
      return { anchor_ids, anchor_labels, anchor_icons, force_anchor, key};
    }

    // Render menu items dynamically based on props from Streamlit
    public renderMenuItems = (): ReactNode => {
      const { activeAnchorId: activeAnchorId } = this.state;

      const { anchor_ids, anchor_labels = anchor_ids, anchor_icons, force_anchor } = this.getCleanedArgs();

      return anchor_ids.map((anchor_id: string, index: number) => (
        <div
          key={anchor_id}
          onClick={() => this.handleMenuClick(anchor_id)}
          style={{
            display: "flex",
            alignItems: "center",
            padding: "15px 20px",
            backgroundColor: activeAnchorId === anchor_id ? "#4A4A4A" : "transparent",
            color: activeAnchorId === anchor_id ? "#fff" : "#FFD700",
            cursor: "pointer",
            fontWeight: activeAnchorId === anchor_id ? "bold" : "normal",
            borderRadius: "8px",
            marginBottom: "10px"
          }}
        >
          {/* Render Bootstrap icon if provided */}
          {anchor_icons && anchor_icons[index] && (
            <i className={`bi ${anchor_icons[index]}`} style={{ marginRight: "10px", fontSize: "18px" }}></i>
          )}
          <span>{anchor_labels[index]}</span>
        </div>
      ));
    };

    // Render sidebar
    public render = (): ReactNode => {
      return (
        <div style={styles.sidebarContainer}>
          <div style={styles.menuTitle}>Menu</div>
          <div>{this.renderMenuItems()}</div>
        </div>
      );
    };
  }

  // Styles for the sidebar container and title
  const styles = {
    sidebarContainer: {
      backgroundColor: "#333",
      height: "100vh",
      padding: "20px",
      color: "#fff",
      fontFamily: "Arial, sans-serif",
      width: "250px"
    },
    menuTitle: {
      fontSize: "18px",
      fontWeight: "bold",
      marginBottom: "20px",
    }
  };

  export default withStreamlitConnection(SidebarMenu);