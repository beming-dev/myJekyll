---
layout: post
category: React+NodeJS
thumbnail: reactNode.jpg
tags: [React, NodeJS, http, https]
typora-copy-images-to: ..\assets\images
typora-root-url: ..
typora-copy-images-to: github blog\beming-dev.github.io\assets\images
typora-root-url: github blog\beming-dev.github.io
---

local에서 https사용하기

# 오류

쇼핑몰 프로젝트를 하면서 2번째 문제가 생겼다. iamport라는 api를 사용해서 결제 기능을 테스트 하려했는데, 아무리 해봐도 결제 정보가 전송되질 않았다. 구글링 해본결과 이번에도 역시 쿠키와 관련된 문제라는 느낌이 왔고, 시간이 오래걸릴것 같다는 느낌이 들었다..

<br/>

<br/>

# 원인 찾기

다행히 이번에는 원인을 찾는게 오래 걸리지는 않았다. 클라이언트 사이드에서 아래와 같은 samesite오류 메세지가 떴는데 대충 읽어보니 cookie의 samesite옵션 때문에 cross-site로 쿠키 전송에 문제가 생겼다는 것 같다.

![화면 캡처 2021-04-27 153017](/assets/images/화면 캡처 2021-04-27 153017.png)

구글링해보니, chrome의 쿠키 정책이 바뀌면서, 쿠키 옵션중 sameSite의 기본값이 None에서 Lax로 바뀌었다고 한다. 

sameSite는 도메인 간 쿠키 전송의 보안에 대한 옵션이다. None일 경우,  모든 상황에서 쿠키 전송이 가능하고, Strict일 경우 다른 도메인간 전송이 아예 불가능하고, Lax일 경우 Strict에서 일부 예외를 두어 쿠키 전송을 허용한다고 한다. 

그래서 문제를 해결하려고 당연히 처음에는 Samesite의 option을 바꿔봤다. 검색해본 결과 

```javascript
app.use(
  session({
	cookie:{
		secure:true,
		sameSite:none
	}
  })
);
```

이런식으로 설정을 해주던데, 왜 session에서 이 옵션을 주는지도 모르겠고, 작동하지도 않았다.

<br/><br/>

그러다 알게된 사실은 원래 http와 https사이에선 cookie전송이 안된다는 것이다. 그래서 http인 내 local과 https인 api 서버 사이에 쿠키 전송이 안돼서 api를 호출할 수 없었던 것 같다.

api쪽을 http로 바꿀 순 없으니 내 local을 https로 바꿔야 한다.

<br/>

<br/>

# 해결(local https 설치)

[참고 블로그](https://blog.bitsrc.io/using-https-for-local-development-for-react-angular-and-node-fdfaf69693cd)

결론적으로는 mkcert라는 인증서를 사용했는데, 위 블로그를 참고했다.

1. 아래 문서를 참고하여 chocolatey를 설치한다.(mkcert를 설치하기 위한 윈도우 패키지 관리자)

   나의 경우는 powershell을 관리자 권한으로 연 후

   ```shell
   Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))
   ```

   이 공식문서에 있는 코드를 실행해서 설치했다.

   <br/>

   <br/>

2. 설치가 완료되면 아래 명령어를 친다.

   ```shell
   choco install mkcert
   mkcert -install
   ```

   mkcert를 설치하고, local에서 신뢰되는 CA를 설치하는 과정이다.

   <br/>

   <br/>

   

3. 이제 아래 명령어를 치면 ssl인증서와 private key가 주어진다.

   ```
   mkcert localhost
   ```



shell에 뜨는 경로에 들어가서 보면 아래 두 파일이 있을건데, 이 파일들을 사용하면 local환경에서도 https로 접속이 된다. react와 nodejs환경에서는 아래와같이 하면 된다.

![화면 캡처 2021-04-29 092839](/assets/images/화면 캡처 2021-04-29 092839.png)

<br/>

<br/>

4. 아까 그 파일을 프로젝트 폴더에 포함시킨 후, front end 폴더의 package.json에 들어간다.

   ```json
   "scripts": {
       "start": "cross-env HTTPS=true SSL_CRT_FILE=localhost.pem SSL_KEY_FILE=localhost-key.pem 		react-scripts start",
     },
   ```

   이처럼 start명령어 부분을 수정하면 되는데, 만약 윈도우 환경이라면 이때, 

   ```shell
   npm install cross-env
   ```

   명령어로 cross-env를 설치해줘야 한다. macOS라면 아마 cross-env명령어를 빼고 하면 작동이 될 것이다.

   그리고

   ```
   SSL_CRT_FILE=localhost.pem SSL_KEY_FILE=localhost-key.pem
   ```

   이 부분에서 localhost.pem, localhost-key.pem부분은 자신의 파일 경로를 적어줘야 한다. 나는 package.json과 같은 폴더에 뒀기 때문에 그냥 저렇게 써도 됐다.

   <br/>

   <br/>

여기까지만 하면 프론트만 https이고 backend는 http여서 session같은곳에서 또 문제가 생긴다. 이번엔 서버도 https로 바꿔보자.

<br/>

<br/>

5. 본인의 server.js에서 

   ```shell
   npm install https --save
   npm install fs --save
   ```

   명령어로 https를 설치한 다음, 

   <br/>

   <br/>

   

6. 아래처럼 해주고

   ```javascript
   const https = require('https');
   const fs = require("fs");
   
   const options = {
     key: fs.readFileSync('../shopping-mall/localhost-key.pem'),
     cert: fs.readFileSync('../shopping-mall/localhost.pem'),
   }
   ```

   readFileSync안에 부분은 당연히 자신의 파일 위치를 적어줘야 된다.

   <br/>

   <br/>

7. 맨 아래 부분으로 가서 

   ```javascript
   app.listen(port, () => {
       console.log(`server is listening at localhost:${process.env.PORT}`);
   });
   ```

   이 부분을 

   ```javascript
   https.createServer(options, app).listen(port, ()=>{
     console.log(`Listening on potr ${port}`);
   })
   ```

   이렇게 바꿔주면 끝! front에서 이제 서버로 요청을 보낼때 https로 보내면 된다. http로 접속도 하고 싶으면 npm install http로 http도 설치하고 똑같은 방법으로 해주면 될거다(아마..)

<br/>

<br/>

# 끝

이렇게 또 오류를 하나 해결했다. 사실 이번 오류는 오래 걸릴 일은 아니었는데, 중간에 local에서 https를 쓰는 방법으로 nginx-proxy-automation을 사용하려다가 react + nodejs를 같이 실행하도록 dockerfile만드는거에 실패해서 시간이 엄청걸렸다. 어차피 나중에 Docker에 올려야 하긴 하지만 프로젝트가 다 끝나고 할 생각이다.

요즘 대부분 시간을 오류잡는데 쓰다보니 머리도 엄청 아프고 프로젝트가 재밌지가 않다. 하지만 어려운 것도 해야 실력이 늘테니 힘들어도 열심히 해야겄다.