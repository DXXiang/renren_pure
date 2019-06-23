# [renren_pure]待遇领取资格认证系统



## 如何合作开发？

#### 1. 成为Collaborator

* 在项目的issue中给我留言，我会向你发送邀请成为合作开发者
* 在你的绑定邮箱中确认接受我的邀请

#### 2. 或者仅仅fork这个项目为你的repository

* 在你开发完成后向我发出**pull request**

#### 3. 建议

* 无论什么方式，**建议在本地my_dev分支开发，然后push到dev分支上**，最后我们再决定如何`merge`到`master`分支

* 如何做（本地开发，线上merge）？

  1. 先`clone`项目到本地(已经`clone`请跳过)

  2. 然后创建本地`my_dev`分支并且和远程`dev`分支对应
     
     ```shell
     $ git branch -a  #先查看下当前的本地和远程分支
     $ git checkout -b my_dev origin/dev  #假如先前已经track了远程dev分支，则直接git checkout my_dev
     $ git pull #将本地分支my_dev对应的远程分支dev拉下来
     ```
     
  3. 开发
  
  4. push到远程分支，若先前命名本地分支为dev则可直接push
     
     ```shell
     $ git push origin HEAD:dev  #push到远程dev分支
     ```
  5. 线上merge
## 备忘

1. 已有模块内容

   <table style="border-collapse:
    collapse;table-layout:fixed;width:312pt" width="416" cellspacing="0" cellpadding="0" border="0">
    <colgroup><col style="width:54pt" width="72">
    <col style="mso-width-source:userset;mso-width-alt:5280;width:124pt" width="165">
    <col style="mso-width-source:userset;mso-width-alt:3328;width:78pt" width="104">
    <col style="mso-width-source:userset;mso-width-alt:2400;width:56pt" width="75">
    <col style="mso-width-source:userset;mso-width-alt:5056;width:119pt" width="158">
    <col style="mso-width-source:userset;mso-width-alt:1344;width:32pt" width="42">
    </colgroup><tbody><tr style="height:14.25pt" height="19">
     <td style="height:14.25pt;width:54pt" width="72" height="19">模块名称</td>
     <td style="width:124pt" width="165">包名</td>
     <td style="width:78pt" width="104">功能模块</td>
     <td style="width:56pt" width="75">命名前缀</td>
    </tr>
    <tr style="height:14.25pt" height="19">
     <td style="height:14.25pt" height="19">数据管理</td>
     <td>io.sdses.modules.qxda</td>
     <td>全系档案</td>
     <td>Person</td>
    </tr>
    <tr style="height:14.25pt" height="19">
     <td rowspan="9" class="xl65" style="height:128.25pt" height="171">系统管理</td>
     <td rowspan="9" class="xl65">io.sdses.modules.sys</td>
     <td>系统页面视图</td>
     <td>SysPage</td>
    </tr>
    <tr style="height:14.25pt" height="19">
     <td style="height:14.25pt" height="19">系统菜单</td>
     <td>SysMenu</td>
    </tr>
    <tr style="height:14.25pt" height="19">
     <td style="height:14.25pt" height="19">登录相关</td>
     <td>SysLogin</td>
    </tr>
    <tr style="height:14.25pt" height="19">
     <td style="height:14.25pt" height="19">系统配置信息</td>
     <td>SysConfig</td>
    </tr>
    <tr style="height:14.25pt" height="19">
     <td style="height:14.25pt" height="19">用户管理</td>
     <td>SysUser</td>
    </tr>
    <tr style="height:14.25pt" height="19">
     <td style="height:14.25pt" height="19">角色管理</td>
     <td>SysRole</td>
    </tr>
    <tr style="height:14.25pt" height="19">
     <td style="height:14.25pt" height="19">系统日志</td>
     <td>SysLog</td>
    </tr>
    <tr style="height:14.25pt" height="19">
     <td style="height:14.25pt" height="19">数据字典</td>
     <td>SysDict</td>
    </tr>
    <tr style="height:14.25pt" height="19">
     <td style="height:14.25pt" height="19">部门管理</td>
     <td>SysDept</td>
    </tr>
    <!--[if supportMisalignedColumns]-->
    <tr style="display:none" height="0">
     <td style="width:54pt" width="72"></td>
     <td style="width:124pt" width="165"></td>
     <td style="width:78pt" width="104"></td>
     <td style="width:56pt" width="75"></td>
    </tr>
    <!--[endif]-->
   </tbody></table>

计划添加的模块是**微信公众号管理**,包名暂定`io.sdses.modules.wechat`，子功能模块命名前缀为`WechatXX`,如计划开发功能有**消息推送**(命名前缀: `WechatPub`)，推送后内容要存表wechat_pub

计划修改的模块**数据管理**为**认证管理**(authentication manage),包名暂定`io.sdses.modules.auth`,子功能命名前缀为`AuthXX`，修改显示功能模块**全系档案**为**认证档案**(命名前缀: `Auth`),此模块除了显示认证结果数据表`auth_result`、用户账号基本信息表`auth_user`，还需负责认证功能，可以共用一个Controller,开发认证相关Service

2. `qrtz`前缀的数据库是用于Quartz任务调度的,但是相关Bean已经被指导老师注释了,而且也没有相关的DAO层代码以及`MyBatismapper.xml`，暂认为无效
3. `job`模块是关于定时任务的，个人认为暂时可以不用理会，原因是这个模块相关的数据库表`schedule_job`和`schedule_job_log`记录的是项目服务开启的消息。这个模块存在相关的html，但是网页内容结构表`sys_menu`中并未存入其消息，平台上不显示页面。所以认为该模块对平台的使用无影响，仅用于记录服务器启动测试的信息

