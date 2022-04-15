<template>
    <div class="flow-box">
        <!-- 供拖拽图形 -->
        <div class="graph-stencil" ref="flowStencil"></div>
        <!-- 画板 -->
        <div class="graph-container" ref="flowContainer"></div>
        <!-- 修改名称弹框 -->
        <name-drawer ref="nameDrawer" @editCellName="editCellName"></name-drawer>
        <!-- 操作栏 -->
        <toolbar ref="toolbar" @handleClick="handleClick" class="flow-tool"></toolbar>
    </div>
</template>

<script>
import { Graph, Shape, Addon, DataUri } from "@antv/x6";
import "@antv/x6-vue-shape";
import "./shape";
import nameDrawer from "./nameDrawer"
import toolbar from "./toolbar"

export default {
    components: { nameDrawer, toolbar },
    data() {
        return {
            graph: null, //画布图层
            stencil: null, //组件栏组件
            cellId: null,//保存修改节点Id
        };
    },
    mounted() {
        this.initGraph();
    },
    methods: {
        initGraph() {
            // #region 初始化画布
            this.graph = new Graph({
                container: this.$refs.flowContainer,
                grid: {
                    size: 10,
                    visible: true,
                    type: "doubleMesh",
                    args: [
                        {
                            color: "#E7E8EA",
                            thickness: 1,
                        },
                        {
                            color: "#CBCED3",
                            thickness: 1,
                            factor: 5,
                        },
                    ],
                },
                panning: {
                    enabled: true,
                    eventTypes: ["leftMouseDown", "rightMouseDown"],
                },
                mousewheel: {
                    enabled: true,
                    zoomAtMousePosition: true,
                    minScale: 0.5,
                    maxScale: 3,
                },
                connecting: {
                    router: "manhattan",
                    connector: {
                        name: "rounded",
                        args: {
                            radius: 8,
                        },
                    },
                    anchor: "center",
                    connectionPoint: "anchor",
                    allowBlank: false,
                    snap: {
                        radius: 20,
                    },
                    createEdge() {
                        return new Shape.Edge({
                            attrs: {
                                line: {
                                    stroke: "#000",
                                    strokeWidth: 1,
                                    targetMarker: {
                                        name: "block",
                                        width: 12,
                                        height: 8,
                                    },
                                },
                            },
                            zIndex: 0,
                        });
                    },
                    validateConnection({ targetMagnet }) {
                        return !!targetMagnet;
                    },
                },
                highlighting: {
                    magnetAdsorbed: {
                        name: "stroke",
                        args: {
                            attrs: {
                                fill: "#D06269",
                                stroke: "#D06269",
                            },
                        },
                    },
                },
                resizing: true,
                rotating: true,
                snapline: true,
                keyboard: true, //开启监听键盘
                history: true,
                clipboard: true,
                selecting: true, //通过点击或者套索框选节点
            });
            this.initStencil(); //初始化组件菜单栏
            this.initKeyboard(); //工具栏
            this.initEvent(); //鼠标移到组件上 显示连接点
        },
        initStencil() {
            const { graph } = this;
            //初始化拖拽图形组件菜单栏
            this.stencil = new Addon.Stencil({
                title: "组件",
                target: graph,
                stencilGraphWidth: 200,
                stencilGraphHeight: 200,
                collapsable: true,
                layoutOptions: {
                    columns: 4,
                    columnWidth: 48,
                    rowHeight: 40,
                    marginY: 20,
                },
                getDropNode(node) {
                    const size = node.size();
                    return node.clone().size(size.width * 3, size.height * 3);
                },
            });
            const stencilContainer = this.$refs.flowStencil;
            if (stencilContainer) {
                stencilContainer.appendChild(this.stencil.container);
            }
            this.initShape();
        },

        initShape() {
            const { graph, stencil } = this;
            //shape 名字对应shape.js中Graph.registerNode 第一个参数
            const r1 = graph.createNode({ shape: "custom-rect" });
            const r2 = graph.createNode({
                shape: "custom-rect",
                attrs: {
                    body: {
                        rx: 6,
                        ry: 6,
                    },
                },
            });
            const r3 = graph.createNode({
                shape: "custom-polygon",
                attrs: {
                    body: {
                        refPoints: "0,10 10,0 20,10 10,20",
                    },
                },
            });
            const r4 = graph.createNode({
                shape: "custom-circle",
            });
            stencil.load([r1, r2, r3, r4]);
        },

        initEvent() {
            const { graph } = this;
            const container = this.$refs.flowContainer;
            //鼠标移到组件上 显示连接点
            const showPorts = (ports, show) => {
                for (let i = 0, len = ports.length; i < len; i = i + 1) {
                    ports[i].style.visibility = show ? "visible" : "hidden";
                }
            };
            //鼠标进入节点
            graph.on("node:mouseenter", () => {
                const ports = container.querySelectorAll(".x6-port-body");
                showPorts(ports, true);
            });
            //鼠标离开节点
            graph.on("node:mouseleave", () => {
                const ports = container.querySelectorAll(".x6-port-body");
                showPorts(ports, false);
            });
            //鼠标双击节点
            graph.on("node:dblclick", ({ e, x, y, node }) => {
                this.cellId = node.id //保存节点Id
                let cell = node.getAttrs()
                let query = { //表单回显当前节点数据
                    type: 'node',
                    name: cell.label ? cell.label.text : '',
                    fontColor: cell.label ? cell.label.fill : '',
                    backgroundColor: cell.body ? cell.body.fill : '',
                    borderColor: cell.body ? cell.body.stroke : '',
                }
                this.$refs.nameDrawer.openDrawer(query)
            });
            graph.on("edge:dblclick", ({ e, x, y, edge }) => {
                this.cellId = edge.id //保存节点Id
                const { attrs, labels } = edge.store.data //提取节点里的数据信息
                let label = labels && labels.length > 0 ? labels[0].attrs.label : null

                let query = { //表单回显当前节点数据
                    type: 'edge',
                    name: label ? label.text : '',
                    linkColor: attrs.line ? attrs.line.stroke : '',
                    linkFontColor: label ? label.fill : '',
                }
                this.$refs.nameDrawer.openDrawer(query)
            });
        },

        initKeyboard() {
            const { graph } = this;
            // copy cut paste
            graph.bindKey(["meta+c", "ctrl+c"], () => {
                const cells = graph.getSelectedCells();
                if (cells.length) {
                    graph.copy(cells);
                }
                return false;
            });
            graph.bindKey(["meta+x", "ctrl+x"], () => {
                const cells = graph.getSelectedCells();
                if (cells.length) {
                    graph.cut(cells);
                }
                return false;
            });
            graph.bindKey(["meta+v", "ctrl+v"], () => {
                if (!graph.isClipboardEmpty()) {
                    const cells = graph.paste({ offset: 32 });
                    graph.cleanSelection();
                    graph.select(cells);
                }
                return false;
            });

            //undo redo
            graph.bindKey(["meta+z", "ctrl+z"], () => {
                if (graph.history.canUndo()) {
                    graph.history.undo();
                }
                return false;
            });
            graph.bindKey(["meta+shift+z", "ctrl+shift+z"], () => {
                if (graph.history.canRedo()) {
                    graph.history.redo();
                }
                return false;
            });

            // select all
            graph.bindKey(["meta+a", "ctrl+a"], () => {
                const nodes = graph.getNodes();
                if (nodes) {
                    graph.select(nodes);
                }
            });

            //delete
            graph.bindKey("backspace", () => {
                const cells = graph.getSelectedCells();
                console.log(cells)
                if (cells.length) {
                    graph.removeCells(cells);
                }
            });

            // zoom
            graph.bindKey(["ctrl+1", "meta+1"], () => {
                const zoom = graph.zoom();
                if (zoom < 1.5) {
                    graph.zoom(0.1);
                }
            });
            graph.bindKey(["ctrl+2", "meta+2"], () => {
                const zoom = graph.zoom();
                if (zoom > 0.5) {
                    graph.zoom(-0.1);
                }
            });
        },
        editCellName(form) {
            //修改节点信息
            let node = this.graph.getCellById(this.cellId)
            if (node.isNode()) { //判断是否是属性节点
                node.setAttrs( //设置节点属性
                    {
                        label: { text: form.name, fill: form.fontColor }, //修改字体名称/颜色
                        body: { fill: form.backgroundColor, stroke: form.borderColor } //修改背景色/边框色
                    },
                )
            } else {
                node.setAttrs( //设置节点属性
                    //连接线颜色
                    { line: { stroke: form.linkColor }, },
                )
                node.setLabels({
                    attrs: { //连接线字体/颜色
                        label: { text: form.name, fill: form.linkFontColor },
                    },
                })
            }
        },
        handleClick(name) {
            const { graph } = this
            switch (name) {
                case 'zoomIn':
                    graph.zoom(0.1)
                    break
                case 'zoomOut':
                    graph.zoom(-0.1)
                    break
                case 'undo':
                    graph.history.undo()
                    break
                case 'redo':
                    graph.history.redo()
                    break
                case 'delete':
                    graph.clearCells()
                    break
                case 'center':
                    graph.centerContent()
                    break
                default:
                    break
            }
        }
    },
};
</script>

<style lang="scss">
.flow-box {
    width: 100%;
    height: 100vh;
    display: flex;
    position: relative;
    .flow-tool {
        position: absolute;
        top: 0;
        right: 0;
    }
}
.graph-stencil {
    position: relative;
    width: 214px;
    height: 100%;
    border-right: 1px solid #dfe3e8;
}
.graph-container {
    flex: 1;
    height: 100%;
}
.x6-widget-stencil {
    background-color: #fff;
}
.x6-widget-stencil-title {
    background-color: #fff;
}
.x6-widget-stencil-group-title {
    background-color: #fff !important;
}
.x6-widget-transform {
    margin: -1px 0 0 -1px;
    padding: 0px;
    border: 1px solid #239edd;
}
.x6-widget-transform > div {
    border: 1px solid #239edd;
}
.x6-widget-transform > div:hover {
    background-color: #3dafe4;
}
.x6-widget-transform-active-handle {
    background-color: #3dafe4;
}
.x6-widget-transform-resize {
    border-radius: 0;
}
.x6-widget-selection-inner {
    border: 1px solid #239edd;
}
.x6-widget-selection-box {
    opacity: 0;
}
</style>
