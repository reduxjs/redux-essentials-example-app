import { useSelector } from "react-redux";
import { selectUserById } from "./usersSlice";
import { selectAllPosts, selectPostByUser  } from '../posts/postsSlice.js';
import { Link } from 'react-router-dom';

export const UserPage = ({ match }) => {
  const { userId } = match.params;
  
  const user = useSelector((state) => selectUserById(state, userId));
 

  // Когда мы вызываем useSelector() он подписывается на хранилище Redux.
  // Это значит, что useSelector будет запускаться всякий раз, когда в хранилище было отпрвлено действие,
  // даже не важно из какого компонента.

  // const postsForUser = useSelector(state => {
  //   const allPosts = selectAllPosts(state)
  //   return allPosts.filter(post => post.user === userId) <=== https://redux.js.org/usage/deriving-data-selectors#optimizing-selectors-with-memoization
  //   Так делать нельзя, это ломает прицип работы useSelector.
  //   Метод filter возвратит ссылку на новый массив. После каждого вызова (кроме самого первого), useSelector
  //   Выполняет поверхностное сравнение (===) прошлого возвращенного значения и текущего, но т.к. мы всегда возвращаем
  //   новую ссылку, т.е. прошлое значение !== текущему, это приведет к лишнему рендеру компонента, даже не смотря на то,
  //   что у обоих сравниваемых значений одинаковое содержимое,но разные ссылки.
  // })

  // 1 - useSelector запоминает результат прошлого вызова, это значит, что селектор должен возвращать 
  // одну и ту же ссылку если значение не поменялось.
  
  // 2 - Всегда передавать в селектор одну и туже функцию, т.е. так, чтобы её ссылка не менялась после рендера компонента.
  // В моем случае функцию селектора (selectAllPosts) выведена в отдельный файл (или можно вывести за рамки функционального компонента),
  // где ссылка на функцию не будет менятся при рендере компонента.
  
  const postsForUser = useSelector((state) => selectPostByUser(state, userId));
  // selectPostByUser - Мемоизированные селектор созданный при помощи createSelector, теперь не стоит беспокоится о проблемах выше
  // Если мы попытаемся вызвать selectPostsByUserнесколько раз, он будет повторно запускать селектор вывода только в том случае, если что-либо postsили userId изменилось
  
  const postTitles = postsForUser.map((post) => (
    <li key={post.id}>
      <Link to={`/posts/${post.id}`}>{post.title}</Link>
    </li>
  ));

  return (
    <section>
      <h2>{user.name}</h2>

      <ul>{postTitles}</ul>
    </section>
  )
}