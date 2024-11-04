# DB relations

> - 비디오를 업로드한 유저의 속성을 추가해서 유저의 프로필 페이지 내 해당 유저가 업로드한 비디오만 보이도록 하는 페이지를 만든다.

- 비디오 재생 페이지 내에서는 해당 비디오를 업로드한 유저에게만 비디오를 편집할 수 있는 링크가 보여지도록 한다.

* `/src/models/Video.js` 에서 `owner` 속성 추가

```javascript
const videoSchema = new mongoose.Schema({
  // ...
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});
```

- `/src/controller/videoController.js` 에 User 모델 임포트 및 `getVideo`, `postUploadVideo` 메서드를 다음과 같이 수정

```javascript
import userModel from "../models/User";

export const getVideo = async (req, res) => {
  const { id } = req.params;
  const video = await videoModel.findById(id);
  const owner = await userModel.findById(video.owner); // 추가

  //...

  return res.render("watch", {
    pageTitle: video.vlog_title,
    video,
    owner,
  });
};

export const postUploadVideo = async (req, res) => {
  const {
    user: { _id },
  } = req.session; // 추가

  try {
    await videoModel.create({
      vlog_title,
      vlog_desc,
      file_url,
      owner: _id, // 추가
      hashtags: videoModel.formatHashtags(hashtags),
    });

    return res.redirect("/");
  } catch (err) {
    //...
  }
};
```

- `/src/views/watch.pug` 파일에 비디오 유저 추가

```pug
extends base

block content

  //- 추가
  div
    small Uploaded By #{owner.user_name}

  hr

  if String(video.owner) === String(loggedInUser._id)
    a(href=`${video.id}/edit`) Edit Video &rarr;
    br
    a(href=`${video.id}/delete`) Delete Video &rarr;
```

<hr />

- `/src/views/users/my-profile.pug` 파일 생성

```pug
extends ../base

block content
  h1 My Profile
```

- `/src/controller/userController.js` 파일 내 `getUserProfile` 메서드 추가

```javascript
export const getUserProfile = async (req, res) => {
  const { id } = req.params;
  const user = await userModel.findById(id);

  if (!user) {
    return res.status(404).render("404", { pageTitle: "User Not Found." });
  }

  return res.render("users/my-profile", {
    pageTitle: `${user.user_name} Profile`,
    user: user,
  });
};
```

- `/src/views/base.pug`

```pug

  nav
    ul
      if loggedIn
        li
          a(href="/videos/upload") Upload Video
        //- 추가
        li
          a(href=`/users/${loggedInUser._id}`) My Profile
```

## `populate()` 이용

> DB 테이블 간의 realtion 설정하는데 MongoDB에서는 populate() 메서드를 이용한다.

- `/src/controller/userController.js` 에서 Video 모델을 임포트

```javascript
import videoModel from "../models/Video";

export const getUserProfile = async (req, res) => {
  //...

  const videos = await videoModel.find({ owner: user._id });

  return res.render("users/my-profile", {
    pageTitle: `${user.user_name} Profile`,
    user: user,
    videos,
  });
};
```

- `/src/views/users/my-profile.pug` 를 다음과 같이 수정

```pug
extends ../base
include ../mixins/video

block content
  each video in videos
    +video(video)
  else
    div Sorry nothing found.
```

- `/src/controller/videoController.js` 의 `getVideo`에서 `owner` 부분을 다음과 같이 수정할 수 있다.

```javascript
export const getVideo = async (req, res) => {
  const { id } = req.params;
  // const video = await videoModel.findById(id);
  // const owner = await userModel.findById(video.owner);
  const video = await videoModel.findById(id).populate("owner");

  return res.render("watch", {
    pageTitle: video.vlog_title,
    video,
    // owner
  });
};
```

- `/src/views/watch.pug`에 있는 `owner` 변수를 `video.owner._id`로 수정해줌

```pug
extends base

block content

  //- 추가
  div
    small Uploaded By
      a(href=`/users/${video.owner._id}`) #{video.owner.user_name}

  hr

  if String(video.owner._id) === String(loggedInUser._id)
    a(href=`${video.id}/edit`) Edit Video &rarr;
    br
    a(href=`${video.id}/delete`) Delete Video &rarr;
```

<hr />

> 데이터 모델의 Videos 중 한 개의 video의 owner 속성은 데이터 모델 User 하나와 연결되어야함. / User 하나가 소유하는 video는 여러개가 될 수 있음.

- `/src/models/User.js` 에서 videos 속성을 추가해준다.

```javascript
const userSchema = new mongoose.Schema({
  //...
  videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
});
```

- `/src/controller/videoController.js` 에서 `postUploadVideo` 메서드를 다음과 같이 수정한다. (해당 비디오를 업로드할 때 유저 테이블에 해당 비디오의 id값을 넣어줌)

```javascript
export const postUploadVideo = async (req, res) => {
  //...

  try {
    const newVideo = await videoModel.create({
      vlog_title,
      vlog_desc,
      file_url,
      owner: _id,
      hashtags: videoModel.formatHashtags(hashtags),
    });

    // user 변수 추가 후 user.save();
    const user = await userModel.findById(_id);
    user.videos.push(newVideo._id);
    user.save();

    return res.redirect("/");
  } catch (err) {
    //...
  }
};
```

- `/src/controller/userController.js` 에서 `getUserProfile` 메서드 내에서 video를 참조하는 부분을 추가

```javascript
export const getUserProfile = async (req, res) => {
  const { id } = req.params;
  const user = await userModel.findById(id).populate("videos");

  // const videos = await videoModel.find({ owner: user._id }); // 삭제

  return res.render("user/my-profile", {
    pageTitle: `${user.user_name} Profile`,
    user: user,
    // videos // 삭제
  });
};
```
