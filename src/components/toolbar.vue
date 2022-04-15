<template>
    <div class="toolbar">
        <el-tooltip class="item" effect="dark" content="放大" placement="top-start">
            <i class="el-icon-zoom-in" @click="handleClick('zoomIn')"></i>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="缩小" placement="top-start">
            <i class="el-icon-zoom-out" @click="handleClick('zoomOut')"></i>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="撤销" placement="top-start">
            <i class="el-icon-refresh-left" @click="handleClick('undo')"></i>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="恢复" placement="top-start">
            <i class="el-icon-refresh-right" @click="handleClick('redo')"></i>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="适应屏幕" placement="top-start">
            <i class="el-icon-full-screen" @click="handleClick('center')"></i>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="清空" placement="top-start">
            <i class="el-icon-delete" @click="handleClick('delete')"></i>
        </el-tooltip>
    </div>
</template>

<script>
export default {
    data() {
        return {

        }
    },
    methods: {
        handleClick(name) {
            this.$emit('handleClick', name)
        }
    }
}
</script>

<style lang="scss" scoped>
.toolbar {
    background-color: #fff;
    padding: 10px 20px;
    display: flex;
    align-items: center;
    i {
        font-size: 18px;
        cursor: pointer;
        margin-left: 10px;
    }
    i:first-child {
        margin-left: 0;
    }
}
</style>