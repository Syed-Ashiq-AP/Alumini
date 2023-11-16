
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, addDoc, updateDoc, onSnapshot, collection } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { getAuth, GoogleAuthProvider, signInWithRedirect } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
const firebaseConfig = {
  apiKey: "AIzaSyDK0o3hzNddw77hh_g22DxRQbxpB3mgYvM",
  authDomain: "alumini-15aeb.firebaseapp.com",
  projectId: "alumini-15aeb",
  storageBucket: "alumini-15aeb.appspot.com",
  messagingSenderId: "770141916222",
  appId: "1:770141916222:web:1f6e1b41dfd6c48fdc156f",
  measurementId: "G-CPY029GQK4"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth();
const provider = new GoogleAuthProvider();


let email = "", password = "", name = "", ccontant = '', cchat = '';

let data = null;

let chatshot = null,rc=false

document.getElementById("register-btn").addEventListener("click", async () => {
  email = document.getElementById("register-email").value;
  password = document.getElementById("register-password").value;
  name = document.getElementById("register-name").value;

  const docRef = doc(db, "users", email);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    document.getElementById("register-e").innerHTML = "Email already exists";
    setTimeout(() => { document.getElementById("register-e").innerHTML = "" }, 2000)
  } else {
    register();
  }
})



async function register() {
  let tdata = { name: name, password: CryptoJS.AES.encrypt(password, "Secret Passphrase").toString() };
  await setDoc(doc(db, "users", email), tdata);
  switch_mode(0)
}


document.getElementById("login-btn").addEventListener("click", async () => {
  email = document.getElementById("login-email").value;
  password = document.getElementById("login-password").value;

  const docRef = doc(db, "users", email);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    data = docSnap.data();
    login()
  } else {
    document.getElementById("login-e").innerHTML = "Email does not exist";
    setTimeout(() => { document.getElementById("login-e").innerHTML = "" }, 2000)
  }
})

function login() {
  var bytes = CryptoJS.AES.decrypt(data.password, 'Secret Passphrase');
  let decryptpassword = bytes.toString(CryptoJS.enc.Utf8);
  if (decryptpassword == password) {
    localStorage.setItem("log", new Date().getMonth())
    localStorage.setItem("email", email)
    localStorage.setItem("password", data.password)
    load_invites()
    start_listens()
    load_chat_UI()
  } else {
    document.getElementById("login-e").innerHTML = "Wrong Password";
    setTimeout(() => { document.getElementById("login-e").innerHTML = "" }, 2000)
  }
}

document.getElementById("login-g-btn").addEventListener("click", async () => {

  signInWithRedirect(auth, provider).then((result) => {
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;

    const user = result.user;
    console.log(user)
    // ...
  }).catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message; s
    const email = error.customData.email;
    const credential = GoogleAuthProvider.credentialFromError(error);
    console.log(errorCode, errorMessage, email, credential)
    // ...
  });
})


document.getElementById("send_inv_btn").addEventListener("click", async () => {

  let temail = document.getElementById("send_inv_email").value

  const docRef = doc(db, "users", temail);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    let tdata = docSnap.data();
    await send_inv(email, temail, tdata.invites)
  } else {
    document.getElementById("send_inv_e").innerHTML = "Email does not exist";
    setTimeout(() => { document.getElementById("send_inv_e").innerHTML = "" }, 2000)
  }

})

async function load_contacts() {
  let contacts = data.contacts
  if (contacts == undefined) {
    contacts = {}
  }
  let contacts_container = document.getElementById("contacts_container")
  contacts_container.innerHTML = ""
  for (const [k, v] of Object.entries(contacts)) {
    contacts_container.insertAdjacentHTML("beforeend", `
    
    <div class="card-styler">
    <div class="cc-top"></div>
</div>

<div class="card" id="`+ v.email + `-card-contact-` + k + `">
    <div style="justify-content: start;" class="card-container">
        <div class="circular-image">
            <img src="tp.jpg" alt="tp">
        </div>
        <div class="card-content">
            <h5 class="card-title">`+ v.name + `</h5>
            <p style="font-size: 12px;font-weight: 600;color: rgb(122, 122, 122);">`+ v.email + `</p>
        </div>
    </div>
</div>

    `)

    document.getElementById(v.email + `-card-contact-` + k).addEventListener("click", async () => {
      load_contact(v.email, v.email + `-card-contact-` + k)
    })
  }
  contacts_container.insertAdjacentHTML("beforeend", `
  
  <div class="card-styler">
  <div class="cc-top"></div>
</div>

  `)
  contacts_container.children[0].children[0].classList.add("cc-a-top")
  contacts_container.children[1].classList.add("c-active")
  contacts_container.children[2].children[0].classList.add("cc-a-bottom")
  ccontant = contacts_container.children[1].id
  load_contact(contacts_container.children[1].id.split("-")[0], ccontant)
}


async function load_chats() {
  let chats = data.chats
  if (chats == undefined) {
    chats = []
  } else {
    let chats_container = document.getElementById("chats_container")
    chats_container.innerHTML = ""
    for (const [k, v] of Object.entries(chats)) {

      const docRef = doc(db, "chats", v);
      const docSnap = await getDoc(docRef);
      let edata = docSnap.data();
      let mail = '', nam = ''
      let lastmsg = ''
      if (edata.msg != undefined) {
        lastmsg = edata.msg[edata.msg.length - 1].txt
      }
      if (edata.emails[0] == email) {
        mail = edata.emails[1]
        nam = edata.names[1]
      } else {
        mail = edata.emails[0]
        nam = edata.names[0]
      }

      chats_container.insertAdjacentHTML("beforeend", `
    
    <div class="card-styler">
    <div class="cc-top"></div>
</div>

<div class="card" id="`+ v + `-card-chat-` + k + `">
    <div style="justify-content: start;" class="card-container">
        <div class="circular-image">
            <img src="tp.jpg" alt="tp">
        </div>
        <div class="card-content">
            <h5 class="card-title">`+ nam + `</h5>
            <p style="font-size: 12px;font-weight: 600;color: rgb(122, 122, 122);">`+ lastmsg + `</p>
        </div>
    </div>
</div>

    `)

      document.getElementById(v + `-card-chat-` + k).addEventListener("click", async () => {
        load_chat(v, v + `-card-chat-` + k)
      })
    }
    chats_container.insertAdjacentHTML("beforeend", `
  
  <div class="card-styler">
  <div class="cc-top"></div>
</div>

  `)
    chats_container.children[0].children[0].classList.add("cc-a-top")
    chats_container.children[1].classList.add("c-active")
    chats_container.children[2].children[0].classList.add("cc-a-bottom")
    cchat = chats_container.children[1].id
    load_chat(chats_container.children[1].id.split("-")[0], cchat)
  }
}

async function load_contact(cemail, cid) {
  document.getElementById(ccontant).previousElementSibling.children[0].classList.remove("cc-a-top")
  document.getElementById(ccontant).classList.remove("c-active")
  document.getElementById(ccontant).nextElementSibling.children[0].classList.remove("cc-a-bottom")
  const docRef = doc(db, "users", cemail);
  const docSnap = await getDoc(docRef);
  let edata = docSnap.data();
  document.getElementById("contact-name").innerText = edata.name
  ccontant = cid
  document.getElementById(ccontant).previousElementSibling.children[0].classList.add("cc-a-top")
  document.getElementById(ccontant).classList.add("c-active")
  document.getElementById(ccontant).nextElementSibling.children[0].classList.add("cc-a-bottom")

}


async function load_chat(cid, id) {
  document.getElementById(cchat).previousElementSibling.children[0].classList.remove("cc-a-top")
  document.getElementById(cchat).classList.remove("c-active")
  document.getElementById(cchat).nextElementSibling.children[0].classList.remove("cc-a-bottom")
  const docRef = doc(db, "users", id.split("-")[3]);
  const docSnap = await getDoc(docRef);
  let edata = docSnap.data();
  document.getElementById("chat-name").innerText = edata.name
  cchat = id
  document.getElementById(cchat).previousElementSibling.children[0].classList.add("cc-a-top")
  document.getElementById(cchat).classList.add("c-active")
  document.getElementById(cchat).nextElementSibling.children[0].classList.add("cc-a-bottom")

  const docref = doc(db, "chats", cid);
  const docrnap = await getDoc(docref);
  let chatref = docrnap.data();

  let msg = chatref.msg, chats_container = document.getElementById("chats_ui_container")
  chats_container.innerHTML = ''
  if (msg == undefined) {
    msg = []
  }
  for (const [k, v] of Object.entries(msg)) {
    if (v.from != email) {
      chats_container.insertAdjacentHTML("afterbegin", `

      <div class="chat-message-recived">
          <div class="circular-image">
              <img src="tp.jpg" alt="tp">
          </div>
          <div class="chat-message received">
              <p>`+ v.txt + `</p>
          </div>
      </div>

      `);
    } else {
      chats_container.insertAdjacentHTML("afterbegin", `

      
      <div class="chat-message-sent">
      <div class="chat-message sent">
          <p>`+ v.txt + `</p>
      </div>
      <div class="circular-image">
          <img src="tp.jpg" alt="tp">
      </div>
  </div>

      `);

    }
  }
  if(chatshot != null){
  chatshot()
  }
  rc=false
  set_up_chat(cid)

}

async function set_up_chat(cid) {
  chatshot = onSnapshot(
    doc(db, "chats", cid),
    (doc) => {
  console.log("lc")
      if(rc == true){
      let chatref = doc.data()
      let msg = chatref.msg, chats_container = document.getElementById("chats_ui_container")
      if (msg == undefined) {
        msg = []
      } else {
        let upmsg = msg[msg.length - 1]
        if (upmsg.from != email) {
          chats_container.insertAdjacentHTML("afterbegin", `

      <div class="chat-message-recived">
          <div class="circular-image">
              <img src="tp.jpg" alt="tp">
          </div>
          <div class="chat-message received">
              <p>`+ upmsg.txt + `</p>
          </div>
      </div>

      `);
        } else {
          chats_container.insertAdjacentHTML("afterbegin", `

      
      <div class="chat-message-sent">
      <div class="chat-message sent">
          <p>`+ upmsg.txt + `</p>
      </div>
      <div class="circular-image">
          <img src="tp.jpg" alt="tp">
      </div>
  </div>

      `);

        }
      }

      }else{

          rc=true
        }
    });

}

async function send_msg() {
  let msg = document.getElementById("msg_input").value
  if (msg != '') {
    let msgd = { from: email, txt: msg }
    const docref = doc(db, "chats", cchat.split("-")[0]);
    getDoc(docref).then(docSnap => {
      let chatref = docSnap.data();
      let msgs = chatref.msg
      if (msgs == undefined) {
        msgs = []
      }
      msgs.push(msgd)
      updateDoc(doc(db, "chats", cchat.split("-")[0]), {
        msg: msgs
      });
    })
  }
}

async function load_invites() {
  let sinvites = data.sinvites, invites = data.invites
  if (sinvites == undefined) {
    sinvites = []
  }
  if (invites == undefined) {
    invites = []
  }
  document.getElementById("WN_container").innerHTML = ""
  for (const [k, v] of Object.entries(sinvites)) {
    document.getElementById("WN_container").insertAdjacentHTML("beforeend", `<div class="contact-card">
    <div class="w-cc-left">
        <p>Received request from</p>
        <h2>`+ v + `</h2>
    </div>
    <div class="w-cc-right">
        <button class="wcacceptbtn" style="background-color: rgb(30, 115, 189);">Accept</button>
        <button class="wcdeclinebtn" style="background-color: rgb(232, 33, 33);">Decline</button>
    </div>
</div>`)
    document.getElementsByClassName("wcdeclinebtn")[k].addEventListener("click", async () => {
      decline_inv(v)
    })
    document.getElementsByClassName("wcacceptbtn")[k].addEventListener("click", async () => {
      accept_inv(v)
    })
  }
  for (const [k, v] of Object.entries(invites)) {
    document.getElementById("WN_container").insertAdjacentHTML("beforeend", `<div class="contact-card">
    <div class="w-cc-left">
    <p>Sent request to</p>
        <h2>`+ v + `</h2>
    </div>
    <div class="w-cc-right">
    <button class="wcancelbtn" style="background-color: rgb(148, 148, 148);">Cancel</button>
    </div>
</div>`)
    document.getElementsByClassName("wcancelbtn")[k].addEventListener("click", async () => {
      cancel_inv(v)
    })
  }
}

async function start_listens() {
  const lsnr = onSnapshot(
    doc(db, "users", email),
    { includeMetadataChanges: true },
    (doc) => {
      data = doc.data()
      load_invites()
      load_chats()
      load_contacts()
    });
}

async function send_inv(femail, temail, inv) {
  const docRef = doc(db, "users", femail);
  const docSnap = await getDoc(docRef);
  data = docSnap.data();
  if (data.sinvites == undefined) {
    data.sinvites = []
  }
  data.sinvites.push(femail)
  updateDoc(doc(db, "users", temail), {
    sinvites: data.sinvites
  });
  if (inv == undefined) {
    inv = []
  }
  inv.push(temail)
  updateDoc(doc(db, "users", femail), {
    invites: inv
  });
  close_dialog("dialog-add-contact")
}

async function cancel_inv(femail) {
  let inv = data.sinvites
  inv.splice(inv.indexOf(email), 1)
  updateDoc(doc(db, "users", email), {
    sinvites: inv
  });
  const docRef = doc(db, "users", femail);
  const docSnap = await getDoc(docRef);
  let idata = docSnap.data();
  inv = idata.invites
  inv.splice(inv.indexOf(email), 1)
  updateDoc(doc(db, "users", femail), {
    invites: inv
  });
}

async function decline_inv(femail) {
  let inv = data.invites
  inv.splice(inv.indexOf(femail), 1)
  updateDoc(doc(db, "users", email), {
    invites: inv
  });
  const docRef = doc(db, "users", femail);
  const docSnap = await getDoc(docRef);
  let idata = docSnap.data();
  inv = idata.sinvites
  inv.splice(inv.indexOf(email), 1)
  updateDoc(doc(db, "users", femail), {
    sinvites: inv
  });
}

async function accept_inv(femail) {
  let tc = { email: email, name: data.name }
  const fdocRef = doc(db, "users", femail);
  const fdocSnap = await getDoc(fdocRef);
  let tdata = fdocSnap.data();
  if (tdata.contacts == undefined) {
    tdata.contacts = []
  }
  tdata.contacts.push(tc)
  updateDoc(doc(db, "users", femail), {
    contacts: tdata.contacts
  });
  tc = { email: femail, name: tdata.name }

  const docRef = doc(db, "users", email);
  const docSnap = await getDoc(docRef);
  data = docSnap.data();
  if (data.contacts == undefined) {
    data.contacts = []
  }
  data.contacts.push(tc)
  updateDoc(doc(db, "users", email), {
    contacts: data.contacts
  });
  decline_inv(femail)

}


async function redirect_tab() {
  let chats = {}
  if (data.chats != undefined) {
    chats = data.chats
  } else {
    data.chats = {}
  }
  let cemail = ccontant.split("-")[0], cid = chats[cemail]
  if (cid == null) {
    const docRef = doc(db, "users", cemail);
    const docSnap = await getDoc(docRef);
    let edata = docSnap.data();
    let cdata = { emails: [email, cemail], names: [data.name, edata.name] }
    const docref = await addDoc(collection(db, "chats"), cdata);
    let did = docref.id;
    data.chats[cemail] = did

    updateDoc(doc(db, "users", email), {
      chats: data.chats
    });

    const cRef = doc(db, "users", cemail);
    const sSnap = await getDoc(cRef);
    let sdata = sSnap.data();
    if (sdata.chats == undefined) {
      sdata.chats = {}
    }
    sdata.chats[email] = did
    updateDoc(doc(db, "users", cemail), {
      chats: sdata.chats
    });
  }

  load_chat(cid)
}

document.getElementById("open_chat").addEventListener("click", async () => {
  switch_tab(0)
  redirect_tab()
})

document.getElementById("send_msg_btn").addEventListener("click", async () => {
  send_msg()
})

if (localStorage.getItem("log") == new Date().getMonth()) {
  setTimeout(() => {
    document.getElementById("login-email").value = localStorage.getItem("email")
    document.getElementById("login-password").value = CryptoJS.AES.decrypt(localStorage.getItem("password"), 'Secret Passphrase').toString(CryptoJS.enc.Utf8)
    document.getElementById("login-btn").click()
  }, 1000)
} else {
  localStorage.clear()
}
