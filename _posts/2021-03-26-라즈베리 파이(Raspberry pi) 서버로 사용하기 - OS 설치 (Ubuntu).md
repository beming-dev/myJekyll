---
layout: post
category: 라즈베리파이
thumbnail: Blog.png
---

# 왜 라즈베리 파이 서버를 쓰나

이번에 Node.js, Express를 공부하면서 커뮤니티를 하나 만들게 됐다. 대충 아래 사진처럼 생겼다.(디자인은 하나도 신경쓰지 않았다ㅎㅎ..) 그냥 서버 공부 할 겸 Mysql, session을 사용해서 CRUD기능, 로그인 기능을 구현해놓기만 했다. 

<img src="/assets/images/2021-03-26-라즈베리 파이(Raspberry pi) 서버로 사용하기 - OS 설치 (Ubuntu)/1.png" alt="내 커뮤니티"/>

이제 어느 정도 커뮤니티로 쓸 수 있을 정도가 된 것 같아서 외부에서도 접속할 수 있게 하고 싶었다. 사실 그냥 호스팅 업체를 쓰는 것도 나쁘지 않지만 공부 목적이기 때문에 라즈베리 파이로 서버 돌리는 것도 공부해보자! 해서 라즈베리 파이를 사게 되었다.



# 어떤 OS를 쓸까?

라즈베리 파이는 유명한만큼 많은 OS를 지원한다. 라즈비안, 만자로 리눅스, 우분투 마테, 우분투 서버 등 유명한 것들 외에도 사용할 수 있는 OS가 매우 많다. 처음에는 구글링 해봤을 때 가장 많이 나오는 라즈베리 파이 공식OS 라즈비안을 사용하려 했다. 하지만 우분투가 정보가 많아서 오류 잡기 쉽다는 친구 말을 듣고 우분투 서버를 쓰기로 했다.



# 준비물

라즈베리 파이로 서버를 돌리기 위해 내가 구매한 것들은

- 라즈베리파이 4 4G
- 쿨러 케이스
- 5C 3A C타입 아답터
- 32gb sd카드
- LAN케이블
- sd카드 리더기

아래는 케이스를 다 조립한 후 사진이다.
<img src="/assets/images/2021-03-26-라즈베리 파이(Raspberry pi) 서버로 사용하기 - OS 설치 (Ubuntu)/2.jpg" alt="조립사진"/>

사용할 수 있는 모니터가 있다면 mini hdmi 케이블을 사서 연결해서 쓰는 것이 좋다. 나는 처음 구매할 때 모니터가 필요할 거라는 생각을 못하고 안샀다... 그래서 ssh라는 원격 제어를 할 수 있게 해주는 프로토콜을 사용하기로 했다.



# OS설치

먼저 아래 두 링크에 들어가서 Ubuntu Server 이미지와 sd카드에 이미지를 구워주는 etcher을 다운받아야 한다. 혹시 Ubuntu링크가 안들어가진다면 구글에 "raspberry pi Ubuntu"를 검색하고 들어가서 다운받으면 된다. 

<https://ubuntu.com/download/raspberry-pi>

<https://www.balena.io/etcher/>


둘다 설치한 후 etcher를 들어가면 아래와 같은 모습이 나올텐데, 차례대로 이미지 파일을 선택하고, sd카드를 선택한 후 Flash를 누르면 쉽고 빠르게 이미지가 구워진다. 

<img src="/assets/images/2021-03-26-라즈베리 파이(Raspberry pi) 서버로 사용하기 - OS 설치 (Ubuntu)/3.png" alt="조립사진"/>

완료된 후 내pc에 들어갔을 때, System-boot가 생기면 성공이다. 혹시 드라이브를 포맷하라는 문구가 뜨면 포맷하지 말고 취소하면 된다.

이제 sd카드의 System-boot드라이브에 들어가서 루트 디렉토리에 ssh라는 파일을 생성한다.(우클릭 > 새로만들기 > 텍스트 문서 > ssh입력) 이때 확장자는 꼭 지워야하고 확장자를 바꾸면 쓸 수 없게 될 수 있다는 경고 메세지는 무시한다. 이렇게 루트 디렉토리에 ssh란 파일이 있으면 알아서 ssh를 사용하도록 설정된다고 한다.

벌써 거의 다 했다!  이제 인터넷을 유선으로 쓸지 무선으로 쓸지에 따라 경우가 나뉜다.

### 유선

랜선으로 공유기와 라즈베리 파이를 연결한다!

### 무선

System-boot의 network-config라는 파일을 수정해야 한다. 들어가보면 아마 아래와 같이 뜰 것이다.

```
# This file contains a netplan-compatible configuration which cloud-init
# will apply on first-boot. Please refer to the cloud-init documentation and
# the netplan reference for full details:
#
# https://cloudinit.readthedocs.io/
# https://netplan.io/reference
#
# Some additional examples are commented out below
version: 2
ethernets:
  eth0:
    dhcp4: true
    optional: true
#wifis:
#  wlan0:
#    dhcp4: true
#    optional: true
#    access-points:
#      myhomewifi:
#        password: "S3kr1t"
#      myworkwifi:
#        password: "correct battery horse staple"
#      workssid:
#        auth:
#          key-management: eap
#          method: peap
#          identity: "me@example.com"
#          password: "passw0rd"
#          ca-certificate: /etc/my_ca.pem
```

#은 주석처리가 된 부분인데, 

```
# This file contains a netplan-compatible configuration which cloud-init
# will apply on first-boot. Please refer to the cloud-init documentation and
# the netplan reference for full details:
#
# https://cloudinit.readthedocs.io/
# https://netplan.io/reference
#
# Some additional examples are commented out below
version: 2
ethernets:
  eth0:
    dhcp4: true
    optional: true
wifis:
  wlan0:
    dhcp4: true
    optional: true
    access-points:
      "(ssid)":
        password: "(password)"
#      myworkwifi:
#        password: "correct battery horse staple"
#      workssid:
#        auth:
#          key-management: eap
#          method: peap
#          identity: "me@example.com"
#          password: "passw0rd"
#          ca-certificate: /etc/my_ca.pem
```

위와 같이 주석을 풀어주고, (ssid)에는 공유기 이름을, (password)에는 공유기 비밀번호를 입력하면 된다. 



### 공통

이제 sd카드를 제거하고 라즈베리 파이에 꽂아주면 된다! 그리고 ssh에 접속하면 된다. ssh에 접속하기 위해서는 라즈베리 파이의 ip주소를 알아야 한다. 

1. 주소창에 192.168.0.1을 입력하고 각자의 공유기 사이트에 접속한다. 접속이 안되면 cmd를 열고 ipconfig를 입력한다음 기본 게이트웨이에 적힌 주소를 입력해 보자. 나의 경우는 192.168.35.1이었다.

   공유기 사이트의 아이디/비밀번호는 웬만하면 admin/admin인데 혹시 안되면 구글링하면 나온다. 접속했으면 연결된 디바이스 정보에서 라즈베리 파이의 ip를 찾아내자.

2. cmd를 열고 

   ```
   ssh ubuntu@ip주소
   ```

   를 입력하면 접속이 된다!  그럼 password를 입력하는 부분이 나올텐데 처음 password는 ubuntu이고, 입력하면 비밀번호를 바꾸라고 한다. 최대한 어려운 비밀번호로 바꿔놓도록 하자.





# 끝

이렇게 생각보다는 쉬운(?) OS설치가 끝났다. 나는 처음에 우분투 이미지가 sd카드에 잘못 구워져서 공유기 사이트에 라즈베리 파이가 뜨지 않았다. 멍청했던 나는 라즈베리 파이가 부팅이 이렇게 오래걸리나..? 싶어 10분이고 20분이고 기다렸지만 될리가... 라즈베리파이에서 LAN선을 20번정도 꼈다 뺐다 한 후에야 혹시 이미지가 잘못구워진걸까 싶어 다시 구워봤더니 바로 됐다ㅠㅠ 라즈베리 파이 부팅은 30초면 되는거였다. 이 과정에서 sd카드에 이미지를 다시 굽는 중에도 파티션을 다 날려버려서 어떻게 복구하지.. 다시 사야되나 싶은 일도 있었다. 

