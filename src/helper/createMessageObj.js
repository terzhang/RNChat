export const randomId = () => {
  return Math.floor(Math.random() * 100);
};

const createMessageObj = (
  text,
  name,
  id = randomId(),
  avatar = 'https://placeimg.com/140/140/any'
) => {
  return {
    _id: id,
    text: text,
    createdAt: new Date(),
    user: {
      _id: id,
      name: name,
      avatar: avatar
    }
  };
};

export default createMessageObj;
