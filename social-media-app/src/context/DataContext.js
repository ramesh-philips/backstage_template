import { createContext, useEffect, useState } from "react";
import { format } from "date-fns";
import api from "../api/posts";
import useWindowSize from "../hooks/useWindowSize";
import useAxiosFetch from "../hooks/useAxiosFetch";
import { useNavigate } from "react-router-dom";

const DataContext = createContext({});

export const DataProvider = ({ children }) => {
  // const [posts, setPosts] = useState([
  //   {
  //     id: 1,
  //     title: "My First post",
  //     datetime: "July 01, 2021 11:17:36 AM",
  //     body: "Made a  video about Tesla Q1 results"
  //   },
  //   {
  //     id: 2,
  //     title: "My second post",
  //     datetime: "July 02, 2021 11:17:36 AM",
  //     body: "Made a  video about Tesla Q2 results"
  //   },
  //   {
  //     id: 3,
  //     title: "My third post",
  //     datetime: "July 03, 2021 11:17:36 AM",
  //     body: "Made a  video about Tesla Q3 results"
  //   },
  //   {
  //     id: 4,
  //     title: "My fourth post",
  //     datetime: "July 04, 2021 11:17:36 AM",
  //     body: "Made a  video about Tesla Q4 results"
  //   }
  // ])

  const [posts, setPosts] = useState([]);

  const [searchResults, setSearchResults] = useState([]);
  const [search, setSearch] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const [postBody, setPostBody] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");
  const { width } = useWindowSize();
  const navigate = useNavigate();
  const { data, fetchError, isLoading } = useAxiosFetch(
    "http://localhost:3500/posts",
  );

  useEffect(() => {
    setPosts(data);
  }, [data]);

  // useEffect(() => {
  //   const fetchPosts = async () => {
  //     try {
  //       const response = await api.get('/posts');
  //       setPosts(response.data);
  //     } catch (err) {
  //       if (err.response) {
  //         //Not in the 200 response
  //         console.log(err.response.data)
  //         console.log(err.response.status)
  //         console.log(err.response.headers)
  //       } else {
  //         console.log(`Error: ${err.message}`)
  //       }
  //     }
  //   }

  //   fetchPosts();
  // }, [])

  useEffect(() => {
    const filteredResults = posts.filter(
      (post) =>
        post.body.toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||
        post.title.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
    );
    setSearchResults(filteredResults.reverse());
  }, [posts, search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = posts.length ? posts[posts.length - 1].id + 1 : 1;
    const dateTime = format(new Date(), "MMM dd yyyy pp");
    const newPost = {
      id,
      title: postTitle,
      datetime: dateTime,
      body: postBody,
    };

    try {
      //adding new post into db.json
      const response = await api.post("/posts", newPost);
      const allPosts = [...posts, response.data];
      // const allPosts = [...posts, newPost]
      setPosts(allPosts);
      setPostTitle("");
      setPostBody("");
      navigate("/");
    } catch (err) {
      if (err.response) {
        //Not in the 200 response
        console.log(err.response.data);
        console.log(err.response.status);
        console.log(err.response.headers);
      } else {
        console.log(`Error: ${err.message}`);
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/posts/${id}`);
      const postsLists = posts.filter((post) => post.id !== id);
      setPosts(postsLists);
      navigate("/");
    } catch (err) {
      console.log(`Error: ${err.message}`);
    }
  };

  const handleEdit = async (id) => {
    try {
      const dateTime = format(new Date(), "MMM dd yyyy pp");
      const updatedPost = {
        id,
        title: editTitle,
        datetime: dateTime,
        body: editBody,
      };
      const response = await api.put(`/posts/${id}`, updatedPost);

      setPosts(
        posts.map((post) => (post.id === id ? { ...response.data } : post)),
      );
      setEditTitle("");
      setEditBody("");
      navigate("/");
    } catch (err) {
      console.log(`Error: ${err.message}`);
    }
  };

  return (
    <DataContext.Provider
      value={{
        width,
        search,
        setSearch,
        searchResults,
        fetchError,
        isLoading,
        handleSubmit,
        postTitle,
        setPostTitle,
        postBody,
        setPostBody,
        posts,
        handleEdit,
        editBody,
        setEditBody,
        editTitle,
        setEditTitle,
        handleDelete,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;
