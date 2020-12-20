//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    webServer: 'http://shmily480.vicp.net:8080/admin/recognize/',
    src: '',
    webviewshow: 'hide',
    webviewurl: '',
    gid: "",
    uid: '',
    duration: '',
    height: '',
    size: '',
    width: '',
    ThumbPath: false,
    videoshow: 'hide'

  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  
  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    this.setData({
      gid: options.gid,
      uid: options.uid
    })
  },
 
  chooseVideo: function () {
    var that = this
    wx.chooseVideo({
      success: function (res) {
        that.setData({
        src: res.tempFilePath,
        })
      }
    })
  },
  getLocalVideo: function () {
    var that = this;
    var session_key = wx.getStorageSync('session_key');
    wx.chooseVideo({
      maxDuration: 10,
      success: function (res1) {
      // 这个就是最终拍摄视频的临时路径了
        that.setData({
          src: res1.tempFilePath,
          duration: res1.duration,
          height: res1.height,
          size: res1.size,
          width: res1.width,
          videoshow: 'thumb'
        })
        wx.showToast({
          title: '选择成功',
          icon: 'succes',
          duration: 2000,
          mask: true
        })
      },
    fail: function () {
      console.error("获取本地视频时出错");
    }
    })
  },
  //上传视频方法
  uploadvideo: function () {
    var that = this;
    wx.showLoading({
      title: '上传中',
    })
    var src = this.data.src;
    if (src) {
      that.setData({
      ThumbPath: true
    })
    }
    wx.uploadFile({
    url: that.data.webServer + 'xxxxxx',//服务器接
    formData: {
      'uid': that.data.uid,
      'gid': that.data.gid,
      'duration': that.data.duration,
      'height': that.data.height,
      'size': that.data.size,
      'width': that.data.width
    },
    method: 'POST',//这句话好像可以不用
    filePath: src,
    header: {
      'content-type': 'multipart/form-data'
    },
    name: 'files',//服务器定义的Key值
    success: function (e) {
      wx.hideLoading();
      if (typeof e.data != 'object') {
        e.data = e.data.replace(/\ufeff/g, "");//重点d
        var data = JSON.parse(e.data);
        if (data.status == 1) {
            wx.showToast({
            title: '上传成功',
            icon: 'succes',
            duration: 1000,
            mask: true
          })
          setTimeout(function () {
          that.backHtml();
          }, 1000)
          app.data.students = data.students;
          console.log(app.data.students);
      } else if (data.status == 2) {
      wx.showToast({
        title: '文件过大',
        icon: 'succes',
        duration: 1000,
        mask: true
      })
    }
    }
    },
    fail: function () {
    wx.showToast({
      title: '上传失败',
      icon: 'succes',
      duration: 1000,
      mask: true
    })
    }
    })
  },
  backHtml: function () {
  var that = this;
  wx.reLaunch({
  url: '/pages/index/index?gid=' + this.data.gid
  })
  },
  

})
