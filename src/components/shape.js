import { Graph } from "@antv/x6";

const ports = {
    groups: {
        top: {
            position: "top",
            attrs: {
                circle: {
                    r: 4,
                    magnet: true,
                    stroke: "#5F95FF",
                    strokeWidth: 1,
                    fill: "#fff",
                    style: {
                        visibility: "hidden", // 设置隐藏,在通过事件鼠标移动显示
                    },
                },
            },
        },
        right: {
            position: "right",
            attrs: {
                circle: {
                    r: 4,
                    magnet: true,
                    stroke: "#5F95FF",
                    strokeWidth: 1,
                    fill: "#fff",
                    style: {
                        visibility: "hidden",
                    },
                },
            },
        },
        bottom: {
            position: "bottom",
            attrs: {
                circle: {
                    r: 4,
                    magnet: true,
                    stroke: "#5F95FF",
                    strokeWidth: 1,
                    fill: "#fff",
                    style: {
                        visibility: "hidden",
                    },
                },
            },
        },
        left: {
            position: "left",
            attrs: {
                circle: {
                    r: 4,
                    magnet: true,
                    stroke: "#5F95FF",
                    strokeWidth: 1,
                    fill: "#fff",
                    style: {
                        visibility: "hidden",
                    },
                },
            },
        },
    },
    items: [
        {
            group: "top",
        },
        {
            group: "right",
        },
        {
            group: "bottom",
        },
        {
            group: "left",
        },
    ],
}

Graph.registerNode(
    "custom-polygon",
    {
        inherit: "polygon",
        width: 30,
        height: 15,
        markup: [
            {
                tagName: "polygon",
                selector: "body",
            },
            {
                tagName: "text",
                selector: "label",
            },
        ],
        attrs: {
            body: {
                strokeWidth: 1,
                stroke: "#333333",
            },
        },
        ports: {
            ...ports,
        },
    },
    true
);

Graph.registerNode(
    "custom-circle",
    {
        inherit: "circle",
        width: 20,
        height: 20,
        markup: [
            {
                tagName: "circle",
                selector: "body",
            },
            {
                tagName: "text",
                selector: "label",
            },
        ],
        attrs: {
            body: {
                strokeWidth: 1,
                stroke: "#333333",
            },
        },
        ports: { ...ports },
    },
    true
);

Graph.registerNode(
    "custom-rect",
    {
        inherit: "rect",
        width: 30,
        height: 15,
        markup: [
            {
                tagName: "rect",
                selector: "body",
            },
            {
                tagName: "text",
                selector: "label",
            },
        ],
        attrs: {
            body: {
                strokeWidth: 1,
                stroke: "#333333",
            },
        },
        ports: { ...ports },
    },
    true
);
