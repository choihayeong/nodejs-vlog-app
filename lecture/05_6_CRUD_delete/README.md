# Database : CRUD

> Create - Read - Update - Delete

## Delete

- `Model.findByIdDelete()`를 이용

  - [Model.findByIdDelete()](<https://mongoosejs.com/docs/api/model.html#Model.findByIdAndDelete()>)

### `videoRouter.js` 수정

- 컨트롤러에서 임포트된 `deleteVideo`를 활용해 다음과 같이 수정

```javascript
videoRouter.route("/:id([0-9a-f]{24})/delete").get(deleteVideo);
```

### `videoController.js` 수정

- `deleteVideo`를 `findByIdAndDelete()`를 활용해 다음과 같이 수정

```javascript
export const deleteVideo = async (req, res) => {
  const { id } = req.params;

  await videoModel.findByIdAndDelete(id);

  return res.redirect("/");
};
```
