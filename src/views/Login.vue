<template>
    <div class="container">
        <div class="box">
            <p class="signin" style="margin-top:40px;margin-bottom:70px;">登录</p>
            <input name="user" type="text" placeholder="用户名或邮箱">
            <br />
            <input name="pass" type="password" placeholder="密码" required>
            <button @click="login">登录</button>
            <p class="foot-txt">忘记密码？</p>
            <p class="foot-txt">还不是用户？ <span class="bold">立即注册</span></p>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from "vue-router";
const router = useRouter();
const login = () => {
    localStorage.setItem('isLoggin', true);
    router.push({
        path: "/home",
    });
};
</script>
<style scoped>
@import url("https://fonts.googleapis.com/css?family=Work+Sans: 400,500,600");

.container {
    /* 全屏flex容器 */
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: #f3f4f4;
}

.box {
    /* 删除原来的position: absolute */
    background: #fff;
    border-radius: 0.625rem;
    box-shadow: 0 0 40px 0 rgba(234, 76, 137, 0.6);
    height: 31.25rem;
    width: 25rem;
    /* 添加适当内边距 */
    padding: 20px 20px;
    text-align: center;
}

.logo,
.signin,
input,
button,
.foot-txt,
.signin-row {
    margin: 0 auto;
    position: relative;
}

.logo {
    height: 3.125rem;
    margin-top: 1.875rem;
    width: 3.125rem;
}

p {
    color: #444;
}

.signin {
    font: 600 1.8rem "Work Sans", sans-serif;
    padding: 0.17em;
}

.signin-row {
    display: flex;
    justify-content: space-around;
    margin: 0.625rem auto 0.3rem;
    padding: 0.625rem;
    width: 11rem;
}

.signin-row>i {
    color: #444;
    font-size: 2rem;
    transition: all 0.15s ease-out;
    -webkit-transition: all 0.15s ease-out;
}

.signin-text {
    color: #9da3a5;
    font: 500 0.85rem "Work Sans", sans-serif;
    margin: 0;
    padding-top: 0.625rem;
    text-align: center;
}

i:hover {
    cursor: pointer;
}

.ic1:hover {
    color: #1da1f2;
}

.ic2:hover {
    color: #3b5998;
}

.ic3:hover {
    color: #4285f4;
}

input {
    -webkit-appearance: none;
    -moz-appearance: none;
    background: none;
    border: 0;
    border-bottom: 2px solid #9da3a5;
    font: 500 0.9rem "Work Sans", sans-serif, sans-serif;
    height: 2.15em;
    margin-top: 0.7em;
    transition: all 0.15s ease-out;
    -webkit-transition: all 0.15s ease-out;
    width: 80%;
}

input:focus {
    border-bottom: 2px solid #ea4c89;
    outline: none;
}

::-webkit-input-placeholder {
    color: #9da3a5;
}

::-moz-placeholder {
    color: #9da3a5;
}

:-ms-input-placeholder {
    color: #9da3a5;
}

:-moz-placeholder {
    color: #9da3a5;
}

button {
    background: #ea4c89;
    border: 0;
    border-radius: 1.4em;
    color: #fff;
    font: 1.1rem "Work Sans", sans-serif;
    margin: 1.7em auto 0.6em;
    outline: none;
    padding: 0.6em;
    transition: all 0.15s ease-out;
    -webkit-transition: all 0.15s ease-out;
    width: 80%;
}

button:hover {
    background: #444;
    cursor: pointer;
}

button:focus {
    outline: none;
}

.foot-txt {
    color: #9da3a5;
    font: 500 0.85rem "Work Sans", sans-serif;
    padding: 0.3em;
}

.foot-txt:hover {
    cursor: pointer;
    text-decoration: underline;
}

.bold {
    font-weight: 600;
}
</style>