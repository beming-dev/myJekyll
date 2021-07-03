mysql 명령어 정리

나는 mysql을 shell에서 사용하는데, 명령어가 아직 손에 익지 않아서 헷갈릴 때마다 검색을 하면서 하고있다. 사실 검색한다고 시간이 많이 드는것도 아니고 하지만.. 이왕이면 다 외워서 쓰는게 멋있으니 한번 정리해보려 한다.

# table 생성

```mysql
create table [테이블 이름](
    [column이름] [타입],
    [column이름] [타입],
    ...
);
```

<br/>

<br/>

## 타입

1. 문자

   - CHAR(n) - n byte만큼 저장 가능. 남은 공간은 공백으로 채운다.
   - VARCHAR(n) - n byte만큼 저장 
   - TINYTEXT(n) - 최대 255byte 문자열
   - TEXT(n) - 최대 65535byte 문자열
   - MEDIUMTEXT(n) - 최대 16777215byte 문자열
   - LONGTEXT(n) - 최대 4294967295byte 문자열

2. 숫자

   

3. 날짜

