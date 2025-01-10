# Comments

### Challenge

- 유저의 댓글 삭제하기

  - client-side javascript (`/src/client/js/commentSection.js`)

  ```javascript
  const response = await fetch(`/api/comments/${commentId}`, {
    method: "DELETE",
    // ...
  });
  ```

- sever-side javascript

  - `apiRouter.js`

  ```javascript
  apiRouter.delete("/comments/:id", fn);
  ```
