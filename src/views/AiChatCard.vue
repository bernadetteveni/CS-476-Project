<template>
<div>
    <div v-if="showChatBot">  
      
  <b-card class="chat-widget" no-body>
  <b-card-header  @click="showChatBot=!showChatBot">
    <div class="d-flex align-items-center">
      <b-avatar
        size="34"
        :src="require('@/assets/images/avatars/1.jpg')"
        class="mr-50 badge-minimal"
        badge
        badge-variant="success"
      />
      <h5 class="mb-0">AI Chatbot</h5>
    </div>
  </b-card-header>

  <section class="chat-app-window">
    <!-- User Chat Area -->
    <vue-perfect-scrollbar
      ref="refChatLogPS"
      :settings="perfectScrollbarSettings"
      class="user-chats scroll-area "
      style="height: 400px;"
    >
      <chat-log
        :chat-data="chatData"
        :profile-user-avatar="require('@/assets/images/avatars/8.jpg')"
        :profile-employee-avatar="require('@/assets/images/avatars/1.jpg')"
      />
    </vue-perfect-scrollbar>

    <!-- Message Input -->
    <b-form class="chat-app-form" @submit.prevent="AskAI">
      <b-input-group class="input-group-merge form-send-message mr-1">
        <b-form-input
          v-model="chatInputMessage"
          placeholder="Enter your message"
        />
      </b-input-group>
      <b-button variant="primary" type="submit" > Send </b-button>
   
   
    

   
    </b-form>
  </section>
</b-card>  
    </div>

    

    <b-card-header v-else  @click="showChatBot=!showChatBot">
    <div class="d-flex align-items-center">
      <b-avatar
        size="34"
        :src="require('@/assets/images/avatars/1.jpg')"
        class="mr-50 badge-minimal"
        badge
        badge-variant="success"
      />
      <h5 class="mb-0">AI Chatbot</h5>
    </div>
  </b-card-header>


  </div>
</template>

<script>
import { functions } from '@/firebaseConfig.js'
import {  httpsCallable } from 'firebase/functions';
import {
  BOverlay,
  BCard,
  BCardHeader,
  BAvatar,
  BForm,
  BFormInput,
  BInputGroup,
  BButton,
} from "bootstrap-vue";

import VuePerfectScrollbar from "vue-perfect-scrollbar";
import ChatLog from "@/views/ChatLog.vue";
import Ripple from 'vue-ripple-directive'
import {
  getDatabase,
  ref,
  onChildAdded,
  onChildChanged,
  onChildRemoved,
  orderBy,
  orderByChild,
  equalTo,
  off,
  push,
  set,
} from "firebase/database";
import { getStorage,uploadBytesResumable, getDownloadURL,uploadBytes } from "firebase/storage";
import {ref as refStorage} from  "firebase/storage";
import { db, realTimeDB } from "@/firebaseConfig";
export default {
  directives: {
    Ripple,
  },
  components: {
    BOverlay,
    BCard,
    BCardHeader,
    BAvatar,
    BForm,
    BFormInput,
    BInputGroup,
    BButton,

    // SFC
    ChatLog,

    // 3rd party
    VuePerfectScrollbar,
  },
  data() {
    return {
      showChatBot: false,
      employeeEmail: null,
      employeeName: null,
      id: null,
      studentEmail: null,
      studentName: null,

      messagesRef: null,

      perfectScrollbarSettings: {
        maxScrollbarLength: 150,
        wheelPropagation: false,
      },

      chatInputMessage: "",
      chatData: {
        chat: {
          id: 2,
          userId: 1,
          unseenMsgs: 2,
          chat: [],
        },
        contact: {
          id: "",
          fullName: "Felecia Rower",
          // eslint-disable-next-line global-require
          avatar: require("@/assets/images/avatars/1.png"),
          status: "away",
        },
      },
    };
  },
  mounted(){
    // Create a room and add a welcome message
    // this.chatInputMessage = "Hello " + this.$store.state.user.user.firstName + " "
    // + this.$store.state.user.user.lastName

    // this.sendAMessage()

    // get AI messages for me

    this.employeeName = "AI Chatbot";

    this.chatData.contact.id = "aiEmail@uregina.ca";
    

    // console.log(this.employeeEmail,this.employeeName,this.id,this.studentEmail , this.studentName )
    // Subscribe for messages from database

    const db = getDatabase();
    this.messagesRef = ref(db, "AImessages/" + this.$store.state.user.user.userEmail.replace('@',"!").replace('.','='));
    onChildAdded(this.messagesRef, (data) => {

      var message = JSON.parse(JSON.stringify(data))
      // console.log(message)

      if (message.message == "CREATE-APPOINTMENT"){
        console.log("IN CREATE APPOINTEMNT")
        // data.ref().set({})
        set( ref(db, "AImessages/" + this.$store.state.user.user.userEmail.replace('@',"!").replace('.','=') + "/CREATE-APPOINTMENT"), null )
        this.$router.push({ name: 'create-appointment' }).catch()
      } else {
        this.addAMessage(message);
      }
      
    });
    this.psToBottom();
  },
 
  unmounted() {
    off(this.messagesRef);
  },
  methods: {
    async AskAI() {
      const message = this.chatInputMessage
      this.sendAMessage()
      const addMessage = httpsCallable(functions, 'dialogFlowMiddle');
      const result = await addMessage({ 
        sessionId: this.$store.state.user.user.userEmail,
        queryInput: message,
        RTDBLocation: "AImessages/" + this.$store.state.user.user.userEmail.replace('@',"!").replace('.','='),
      })
      // console.log("RESULT FROM FIREBASE",(result))
      
      
      // const data = result.data;
},
    sendAMessage() {
      // Create a new post reference with an auto-generated id
      const db = getDatabase();
      const postListRef = ref(db, "AImessages/" + this.$store.state.user.user.userEmail.replace('@',"!").replace('.','='));
      const newPostRef = push(postListRef);
      set(newPostRef, {
        message: this.chatInputMessage,
        senderEmail: this.$store.state.user.user.userEmail,
        senderName:
          this.$store.state.user.user.firstName +
          " " +
          this.$store.state.user.user.lastName,
          employeeEmail:"aiEmail@uregina.ca"
      });
      this.chatInputMessage = "";
    },

    addAMessage(newMessage) {
      // console.log("Adding a New Messsage",newMessage)
     
        this.chatData.chat.chat.push({
          message: newMessage.message,
          time: newMessage.dateTime,
          senderName: newMessage.senderName,
          senderEmail: newMessage.senderEmail,
          sender: newMessage.senderEmail,
        });
     
      this.chatInputMessage = "";

      // Update scroll position
      // Scroll to bottom
      this.$nextTick(() => {
        this.psToBottom();
      });
    },
   

    psToBottom() {
      const scrollEl = this.$refs.refChatLogPS.$el || this.$refs.refChatLogPS;
      scrollEl.scrollTop = scrollEl.scrollHeight;
    },
  },
};
</script>

<style lang="scss">
@import "@core/scss/base/pages/app-chat-list.scss";
</style>
