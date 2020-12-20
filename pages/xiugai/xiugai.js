var app = getApp();

Page({
  data:{
    students:app.data.students,
    gdata:{},
    winHeight:0,
    winWidth:0,
  },

  onLoad:function(){
    var page = this;
    //获取系统信息
    wx.getSystemInfo({
      success: (result) => {
        page.setData({winWidth:result.windowWidth});
        page.setData({winHeight:result.windowHeight});
      },
    })
    console.log(app.data)
  },
  onShow:function(){
    this.setData({students:app.data.students});
  },
  deletStudents:function(e){
    var page = this;
    wx.showModal({
      title: '确认删除提示',
      content: '是否删除'+e.currentTarget.dataset.index+'?',
      success: function (res) {
        if (res.confirm) {//这里是点击了确定以后
          var newStduents = app.data.students;
          var index = e.currentTarget.dataset.index;
          newStduents.splice(index,1);
          app.data.students = newStduents;
          page.onShow();
          console.log(newStduents)
          console.log('用户点击确定')
        } else {//这里是点击了取消以后
          console.log('用户点击取消')
        }}
    })
    
  }
})