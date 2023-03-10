# Cookie、Session、Token的详解

## 一、发展史

1、很久很久以前，Web 基本上就是文档的浏览而已， 既然是浏览，作为服务器， 不需要记录谁在某一段时间里都浏览了什么文档，每次请求都是一个新的HTTP协议， 就是请求加响应， 尤其是我不用记住是谁刚刚发了HTTP请求， 每个请求对我来说都是全新的。这段时间很嗨皮。

2、但是随着交互式Web应用的兴起，像在线购物网站，需要登录的网站等等，马上就面临一个问题，那就是要管理会话，必须记住哪些人登录系统， 哪些人往自己的购物车中放商品， 也就是说我必须把每个人区分开，这就是一个不小的挑战，因为HTTP请求是无状态的，所以想出的办法就是给大家发一个会话标识(session id), 说白了就是一个随机的字串，每个人收到的都不一样， 每次大家向我发起HTTP请求的时候，把这个字符串给一并捎过来， 这样我就能区分开谁是谁了

3、这样大家很嗨皮了，可是服务器就不嗨皮了，每个人只需要保存自己的session id，而服务器要保存所有人的session id ！如果访问服务器多了， 就得由成千上万，甚至几十万个。

这对服务器说是一个巨大的开销 ， 严重的限制了服务器扩展能力， 比如说我用两个机器组成了一个集群， 小F通过机器A登录了系统， 那session id会保存在机器A上， 假设小F的下一次请求被转发到机器B怎么办？机器B可没有小F的 session id啊。

有时候会采用一点小伎俩： session sticky ， 就是让小F的请求一直粘连在机器A上， 但是这也不管用， 要是机器A挂掉了， 还得转到机器B去。

![img](https://img-blog.csdnimg.cn/20190509111418335.jpg?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dobDE5MDQxMg==,size_16,color_FFFFFF,t_70)

那只好做session 的复制了， 把session id 在两个机器之间搬来搬去， 快累死了。

后来有个叫Memcached的支了招：把session id 集中存储到一个地方， 所有的机器都来访问这个地方的数据， 这样一来，就不用复制了， 但是增加了单点失败的可能性， 要是那个负责session 的机器挂了， 所有人都得重新登录一遍， 估计得被人骂死。

![img](https://img-blog.csdnimg.cn/20190509111418335.jpg?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dobDE5MDQxMg==,size_16,color_FFFFFF,t_70)

也尝试把这个单点的机器也搞出集群，增加可靠性， 但不管如何， 这小小的session 对我来说是一个沉重的负担

4、于是有人就一直在思考， 我为什么要保存这可恶的session呢， 只让每个客户端去保存该多好？

可是如果不保存这些session id , 怎么验证客户端发给我的session id 的确是我生成的呢？ 如果不去验证，我们都不知道他们是不是合法登录的用户， 那些不怀好意的家伙们就可以伪造session id , 为所欲为了。

嗯，对了，关键点就是验证 ！

比如说， 小F已经登录了系统， 我给他发一个令牌(token)， 里边包含了小F的 user id， 下一次小F 再次通过Http 请求访问我的时候， 把这个token 通过Http header 带过来不就可以了。

不过这和session id没有本质区别啊， 任何人都可以可以伪造， 所以我得想点儿办法， 让别人伪造不了。

那就对数据做一个签名吧， 比如说我用HMAC-SHA256 算法，加上一个只有我才知道的密钥， 对数据做一个签名， 把这个签名和数据一起作为token ， 由于密钥别人不知道， 就无法伪造token了。

这个token 我不保存， 当小F把这个token 给我发过来的时候，我再用同样的HMAC-SHA256 算法和同样的密钥，对数据再计算一次签名， 和token 中的签名做个比较， 如果相同， 我就知道小F已经登录过了，并且可以直接取到小F的user id , 如果不相同， 数据部分肯定被人篡改过， 我就告诉发送者：对不起，没有认证。

Token 中的数据是明文保存的（虽然我会用Base64做下编码， 但那不是加密）， 还是可以被别人看到的， 所以我不能在其中保存像密码这样的敏感信息。

当然， 如果一个人的token 被别人偷走了， 那我也没办法， 我也会认为小偷就是合法用户， 这其实和一个人的session id 被别人偷走是一样的。

这样一来， 我就不保存session id 了， 我只是生成token , 然后验证token ， 我用我的CPU计算时间获取了我的session 存储空间 ！

解除了session id这个负担， 可以说是无事一身轻， 我的机器集群现在可以轻松地做水平扩展， 用户访问量增大， 直接加机器就行。这种无状态的感觉实在是太好了！

# 二、cookie是什么

　　很多朋友并不了解**cookie是什么**，Cookie，有时也用其复数形式 Cookies，指某些网站为了辨别用户身份、进行 session 跟踪而储存在用户本地终端上的数据(通常经过加密)。定义于 RFC2109 和 2965 中的都已废弃，最新取代的规范是 RFC6265。

​		其实cookies是由网络服务器存储在你电脑硬盘上的一个txt类型的小文件，它和你的网络浏览行为有关，所以存储在你电脑上的cookies就好像你的一张身份证，你电脑上的cookies和其他电脑上的cookies是不一样的;cookies不能被视作代码执行，也不能成为病毒，所以它对你基本无害。

​	　cookies的作用主要是，当你访问了某些网页，并且对网页的一些设置进行修改，cookies就能跟踪并记录到这些修改，当你下一次访问这个网页的时候，这个网页会分析你电脑上的cookies，进而采取措施像你返回更符合你个性化的网页;　　当然，目前大部分广告的定位基础也是基于cookies的，比如你此前访问了大量的健身类网站，cookies记录了你的访问行为，广告主就能够根据你的访问行为，向你推送健身类的广告。

![image-20211121133633549](C:\Users\HP\AppData\Roaming\Typora\typora-user-images\image-20211121133633549.png)

​		要向找到cookies，只需要打开电脑上的资源管理器，在搜索框中搜索cookie即可。　　“是否让浏览器记住你的密码？”这句话你是否还记得，我们在浏览器首次登陆某个网站的时候，就会弹出该提示，提醒我们保存账号密码，下次访问就不再需要输入账号密码了，这是Cookie的作用之一，但保存在计算机中的Cookie信息是一个比较私密的内容，既然是放在本地的Cookie内容，那就有可能被有心者一探究竟。让我们一起来深度解析的Cookie的作用和弊端。

　　**浏览器中的Cookie**　　当你浏览某网站时，由Web服务器置于你硬盘上的一个非常小的文本文件，它可以记录你的用户ID、密码、浏览过的网页、停留的时间等信息。当你再次来到该网站时，网站通过读取Cookie，得知你的相关信息，就可以做出相应的动作，如在页面显示欢迎你的标语，或者让你不用输入ID、密码就直接登录等等。如果你清理了Cookie，那么你曾登录过的网站就没有你的修改过的相关信息。Cookie是非常常见的， 基本上你的浏览器中都会存储了成百上千条Cookie信息。

​		浏览器能够自动存储并管理Cookie。你可以在浏览器的设置中找到一大串的网站存储下来的Cookie以及查看这些Cookie。不过查看这些Cookie并不是什么有趣的事情。如果你的系统装有多个浏览器的话，那么每个浏览器都有着自己的Cookie。一个网站只能够读取属于自己网站的Cookie。举个例子来讲，当你访问IT之家时，我们是不能够检测到其它网站的Cookie的，这可以防止恶意网站窥探以及窃取你的登陆信息。　　

​	**Cookie的好处**　　如果没有Cookie的存在，网络对于我们来说不会如此便捷。它存储着你的网站登录信息，如果没有他们，你将不能够登陆网站。网站通过Cookie信息来记忆以及辨认你的帐号，它可以记忆你的偏好设置。它还可以使网站提供个性化的内容，举个例子，如果你在淘宝上购物，淘宝可以记忆你所查看过的产品并据此来向你来推荐商品，即便你没有登陆个人帐号。　　

​	**Cookie的坏处**　　伴随着互联网巨大商机的出现，Cookie也从一项服务性工具变成了一个可以带来巨大财富的工具。部分站点利用Cookie收集大量用户信息，并将这些信息转手卖给其他有商业目的的站点或组织，如网络广告商等，从中牟利。使用Cookie技术，您在浏览Web站点时，不论是否愿意，您的每一个X作都有可能被记录下来，在毫无防备的情况下，您正在浏览的网站地址、使用的计算机的软硬件配置，甚至您的名字、电子邮件地址都有可能被收集并转手出售。随着互联网的商业化发展，该问题越来越严重，个人隐私的泄露所带来的并不单纯是一些垃圾邮件，一旦个人资料被滥用，信用卡密码被盗，后果不堪设想。也正因为如此，有关Cookie的争论从未停止过，用户对Cookie的态度也是爱恨交加。　　

​	管理浏览器中的Cookie　　你可以通过设置窗口来管理浏览器的Cookie信息。当在清除Cookie时，你需要注意的是该网站对你是否有价值，是否还要登陆。　　上文便是关于Cookie的作用和弊端的深度解析，Cookie是一把双刃剑，笔者建议用户周期性的清理Cookie和临时文件，当然，清理浏览器历史记录也很有必要。 

## 三、Session

​	session 从字面上讲，就是会话。这个就类似于你和一个人交谈，你怎么知道当前和你交谈的是张三而不是李四呢？对方肯定有某种特征（长相等）表明他就是张三。

​	session 也是类似的道理，服务器要知道当前发请求给自己的是谁。为了做这种区分，服务器就要给每个客户端分配不同的“身份标识”，然后客户端每次向服务器发请求的时候，都带上这个“身份标识”，服务器就知道这个请求来自于谁了。至于客户端怎么保存这个“身份标识”，可以有很多种方式，对于浏览器客户端，大家都默认采用 cookie 的方式。

​	服务器使用session把用户的信息临时保存在了服务器上，用户离开网站后session会被销毁。这种用户信息存储方式相对cookie来说更安全，可是session有一个缺陷：如果web服务器做了负载均衡，那么下一个操作请求到了另一台服务器的时候session会丢失。

## 四、Token

​	用户通过用户名和密码发送请求。

​	服务端验证,  返回生成的token 给客户端,  同时给数据库和Redis里关联token和用户信息。

​	客户端储存token,并且其后的每一次请求都添加token, token应该在HTTP的头部发送从而保证了Http请求无状态。

​	服务端查询Redis+数据库, 验证token并返回数据。

​	Tokens的优势

​	无状态
​		在客户端存储的Tokens是无状态的，并且能够被扩展。基于这种无状态和不存储Session信息，负载负载均衡器能够将用户信息从一个服务传到其他服务器上。

​	安全性
​		请求中发送token而不再是发送cookie能够防止CSRF(跨站请求伪造)。即使在客户端使用cookie存储token，cookie也仅仅是一个存储机制而不是用于认证。不将信息存储在Session中，让我们少了对session操作。

​		token是有时效的，一段时间之后用户需要重新验证。我们也不一定需要等到token自动失效，token有撤回的操作，通过token revocataion可以使一个特定的token或是一组有相同认证的token无效。

​	可扩展性
​		Tokens能够创建与其它程序共享权限的程序。例如，能将一个随便的社交帐号和自己的大号(Fackbook或是Twitter)联系起来。当通过服务登录Twitter(我们将这个过程Buffer)时，我们可以将这些Buffer附到Twitter的数据流上(we are allowing Buffer to post to our Twitter stream)。

​		使用tokens时，可以提供可选的权限给第三方应用程序。当用户想让另一个应用程序访问它们的数据，我们可以通过建立自己的API，得出特殊权限的tokens。

​	支持多平台跨服务器
​		只要用户有一个通过了验证的token，数据和资源就能够在任何平台(Android,ios, h5)任何服务器上被请求到。

## 五、最后做个三者的比较: 

cookie : 

1. cookie由服务器生成，保存在客户端浏览器。

2. 容易被劫持，不安全，别人可以分析存放在本地的COOKIE并进行COOKIE欺骗。

3. cookie可以被用户禁止

4. 容量小, 单个cookie保存的数据不能超过4K，很多浏览器都限制一个站点最多保存20个cookie。

session：

1. session是由应用服务器维持的一个服务器端的存储空间, 没有对存储的数据量的限制，可以保存更为复杂的数据类型.

2. session 默认被存在在服务器的一个文件里, 但是实际中可以放在 文件、数据库、或内存中都可以。

3. 当用户量增多时，会对服务器造成较大压力。

4. Session的实现方式大多数情况用Cookie保存的，但是也可以使用URL地址重写。

5. 较安全,用户验证这种场合一般会用 session, 比如金融银行类的产品, 

token：

​	1.无状态、可扩展

​	2.支持移动设备

​	3.跨服务器调用

​	4.安全

## 六、总结服务端与客户端交互（token/cookie/session）

### 1、登录机制

粗略地分析， 登录机制主要分为登录验证、登录保持、登出三个部分。登录验证是指客户端提供用户名和密码，向服务器提出登录请求，服务器判断客户端是否可以登录并向客户端确认。 登录认保持是指客户端登录后， 服务器能够分辨出已登录的客户端，并为其持续提供登录权限的服务器。登出是指客户端主动退出登录状态。容易想到的方案是，客户端登录成功后， 服务器为其分配sessionId, 客户端随后每次请求资源时都带上sessionId。

#### 1.1 登录验证

上述简易的登录验证策略存在明显的安全漏洞,需要优化。

##### 1.1.1 密码的传输

​	客户端第一次发出登录请求时， 用户密码以明文的方式传输， 一旦被截获， 后果严重。因此密码需要加密，例如可采用RSA非对称加密。具体流程如下：

- 客户端向服务器第一次发起登录请求（不传输用户名和密码）。
- 服务器利用RSA算法产生一对公钥和私钥。并保留私钥， 将公钥发送给客户端。
- 客户端收到公钥后， 加密用户密码， 向服务器发起第二次登录请求（传输用户名和加密后的密码）。
- 服务器利用保留的私钥对密文进行解密，得到真正的密码。

##### 1.1.2 登录状态token

​	再仔细核对上述登录流程， 我们发现服务器判断用户是否登录， 完全依赖于sessionId, 一旦其被截获， 黑客就能够模拟出用户的请求。于是我们需要引入token的概念： 用户登录成功后， 服务器不但为其分配了sessionId, 还分配了token， token是维持登录状态的关键秘密数据。在服务器向客户端发送的token数据，也需要加密。于是一次登录的细节再次扩展。

- 客户端向服务器第一次发起登录请求（不传输用户名和密码）。
- 服务器利用RSA算法产生一对公钥和私钥。并保留私钥， 将公钥发送给客户端。
- 客户端收到公钥后， 加密用户密码，向服务器发送用户名和加密后的用户密码； 同时另外产生一对公钥和私钥，自己保留私钥, 向服务器发送公钥； 于是第二次登录请求传输了用户名和加密后的密码以及客户端生成的公钥。
- 服务器利用保留的私钥对密文进行解密，得到真正的密码。 经过判断， 确定用户可以登录后，生成sessionId和token， 同时利用客户端发送的公钥，对token进行加密。最后将sessionId和加密后的token返还给客户端。
- 客户端利用自己生成的私钥对token密文解密， 得到真正的token。

#### 1.2 登录保持

​	在最原始的方案中， 登录保持仅仅靠服务器生成的sessionId: 客户端的请求中带上sessionId, 如果服务器的redis中存在这个id，就认为请求来自相应的登录客户端。 但是只要sessionId被截获， 请求就可以为伪造， 存在安全隐患。

​	引入token后，上述问题便可得到解决。 服务器将token和其它的一些变量， 利用散列加密[算法](http://lib.csdn.net/base/31)得到签名后，连同sessionId一并发送给服务器； 服务器取出保存于服务器端的token,利用相同的法则生成校验签名， 如果客户端签名与服务器的校验签名一致， 就认为请求来自登录的客户端.

#### 1.3 TOKEN失效

用户登录出系统

失效原理：
在服务器端的redis中删除相应key为session的键值对。

### 2.localStorage和sessionStorage是Web提供的两种本地存储方式。

​	相比较cookie而言，localStorage和sessionStorage的存储大小很大，localStorage能够长期保存，sessionStorage在会话期间保存。

​	localStorage和sessionStorage都是window对象提供的全局属性，用途都是在浏览器中存储key/value对的数据。

​	从使用的角度来看，两者的唯一区别在于时效性。

​	sessionStorage在关闭窗口或标签页之后将会删除这些数据。

​	而localStorage则没有这样的特性，今天、下周、明年、一百年，甚至理论上的成千上万年后都能用，除非你手动去删除。

​	如果你想在浏览器窗口关闭后还保留数据，请使用localStorage。

​	如果你是想用于临时保存同一窗口（或标签页）的数据，请使用sessionStorage。