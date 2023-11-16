let data = null

let c_tab = 0;

let tabs = document.getElementsByClassName("tab-container"),navs= document.getElementsByClassName("nav-item")

function switch_mode(mode) {
    if (mode) {
        document.getElementById("login-ui").style.opacity = 0;
        setTimeout(() => {
            document.getElementById("login-ui").style.display = "none";
            document.getElementById("register-ui").style.display = "flex";
            setTimeout(() => {
                document.getElementById("register-ui").style.opacity = 1;
            }, 300);
        }, 300)
    } else {
        document.getElementById("register-ui").style.opacity = 0;
        setTimeout(() => {
            document.getElementById("register-ui").style.display = "none";
            document.getElementById("login-ui").style.display = "flex";
            setTimeout(() => {
                document.getElementById("login-ui").style.opacity = 1;
            }, 300);
        }, 300)

    }
}

function switch_tab(tab) {
    if (c_tab != tab) {
        tabs[c_tab].style.opacity = 0;
        navs[c_tab].classList.remove("nav-active");
        navs[tab].classList.add("nav-active");
        setTimeout(() => {
            tabs[c_tab].style.display = "none";
            tabs[tab].style.display = "flex";
            setTimeout(() => {
                tabs[tab].style.opacity = 1;
                c_tab=tab
            }, 300);
        }, 300)
    }
}

function open_dialog(dialog){
    document.getElementById(dialog).style.display="flex"
}

function close_dialog(dialog){
    document.getElementById(dialog).style.display="none"
}

function load_chat_UI() {
    document.getElementById("auth-ui").style.opacity = 0;
    setTimeout(() => {
        document.getElementById("auth-ui").style.display = "none";
        document.getElementById("chat-ui").style.display = "flex";
        setTimeout(() => {
            document.getElementById("chat-ui").style.opacity = 1;
        }, 300);
    }, 300)
}