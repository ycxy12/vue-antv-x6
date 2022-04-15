<template>
    <el-drawer title="编辑" :visible.sync="drawer" :direction="direction" :before-close="handleClose">
        <el-form :model="ruleForm" ref="ruleForm" label-width="100px">
            <el-form-item label="名称" prop="name">
                <el-input v-model="ruleForm.name"></el-input>
            </el-form-item>
            <el-form-item label="字体颜色" prop="fontColor" v-if="ruleForm.type==='node'">
                <el-color-picker v-model="ruleForm.fontColor"></el-color-picker>
            </el-form-item>
            <el-form-item label="背景颜色" prop="backgroundColor" v-if="ruleForm.type==='node'">
                <el-color-picker v-model="ruleForm.backgroundColor"></el-color-picker>
            </el-form-item>
            <el-form-item label="边框颜色" prop="borderColor" v-if="ruleForm.type==='node'">
                <el-color-picker v-model="ruleForm.borderColor"></el-color-picker>
            </el-form-item>
            <el-form-item label="连接线颜色" prop="linkColor" v-if="ruleForm.type==='edge'">
                <el-color-picker v-model="ruleForm.linkColor"></el-color-picker>
            </el-form-item>
            <el-form-item label="连接字体颜色" prop="linkFontColor" v-if="ruleForm.type==='edge'">
                <el-color-picker v-model="ruleForm.linkFontColor"></el-color-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
                <el-button @click="resetForm('ruleForm')">取消</el-button>
            </el-form-item>
        </el-form>
    </el-drawer>
</template>

<script>
export default {
    data() {
        return {
            drawer: false,
            direction: 'rtl',
            ruleForm: {},
        }
    },
    methods: {
        openDrawer(query) {
            this.ruleForm = query
            this.drawer = true
        },
        handleClose() {
            this.drawer = false
        },
        submitForm() {
            this.$emit('editCellName', this.ruleForm)
            this.resetForm()
        },
        resetForm() {
            this.handleClose()
            this.$refs.ruleForm.resetFields();
        }
    }
}
</script>

<style>
</style>