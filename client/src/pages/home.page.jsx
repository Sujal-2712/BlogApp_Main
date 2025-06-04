import axios from "axios";
import InPageNavigation from "../components/inpage-navigation.component";
import { API_URL } from './../../config';
import { useEffect, useState } from "react";
import Loader from './../components/loader.component';
import BlogPostCard from "../components/blog-post.component";
import NoDataMessage from "../components/nodata.component";
import LoadMoreData from "../components/load-more.component";
import MinimalBlogPost from "../components/nobanner-blog-post.component";
import filterPaginationData from "../common/filter-pagination-data";

const categories = ["programming", "hollywood", "film making", "social media", "cooking", "tech", "finances", "sports"];

const TrendingBlogs = ({ blogs }) => {
    if (blogs === null) return <Loader />;
    if (blogs.length > 0) {
        return blogs.map((item, index) => (
           
            <MinimalBlogPost key={index} blog={item} index={index} />
        ));
    } else {
        return <NoDataMessage message={"No Trending Blogs Found!!"} />;
    }
};

const HomePage = () => {
    const [blog, setBlog] = useState(null);
    const [trendingBlog, setTrendingBlog] = useState(null);
    const [pageState, setPageState] = useState("home");

    const fetchLatestBlogs = async (page = 1) => {
        try {
            const result = await axios.post(`${API_URL}/latest-blogs`, { page });
            const formattedData = await filterPaginationData({
                state: blog,
                data: result.data,
                page,
                countRoute: "/all-latest-blogs-count"
            });
            setBlog(formattedData);
        } catch (error) {
            console.error("Error fetching latest blogs:", error);
        }
    };

    const fetchTrendingBlogs = async () => {
        try {
            const result = await axios.get(`${API_URL}/trending-blogs`);
            setTrendingBlog(Array.isArray(result.data) ? result.data : []);
        } catch (error) {
            console.error("Error fetching trending blogs:", error);
            setTrendingBlog([]);
        }
    };

    const loadBlogCategory = (e) => {
        const category = e.target.innerText.toLowerCase(); // Convert category to lowercase
        setBlog(null);
        setPageState(category === pageState ? "home" : category); // Toggle between category and "home"
    };

    const fetchBlogsByCategory = async (page = 1) => {
        try {
            const result = await axios.post(`${API_URL}/search-blogs`, { tag: pageState, page });
            const formattedData = await filterPaginationData({
                state: blog,
                data: result.data,
                page,
                countRoute: "/search-blogs-count",
                data_to_send: { tag: pageState }
            });
            setBlog(formattedData);
        } catch (error) {
            console.error("Error fetching blogs by category:", error);
        }
    };

    useEffect(() => {
        if (pageState === "home") {
            fetchLatestBlogs(1);
        } else {
            fetchBlogsByCategory(1);
        }

        if (!trendingBlog) {
            fetchTrendingBlogs();
        }
    }, [pageState]);

    return (
        <>
            <section className="h-cover flex justify-center gap-10">
                <div className="w-full">
                    <InPageNavigation routes={["home"]}>
                        <>
                            {
                                blog === null ? <Loader /> :
                                blog.results.length > 0 ?
                                    blog.results.map((item, index) => (
                                        <BlogPostCard key={index} content={item} author={item.author?.personal_info} />
                                    )) :
                                    <NoDataMessage message={"No Blogs Found!!"} />
                            }
                            <LoadMoreData state={blog} fetchDataFun={pageState === "home" ? fetchLatestBlogs : fetchBlogsByCategory} />
                        </>
                        <TrendingBlogs blogs={trendingBlog} />
                    </InPageNavigation>
                </div>

                <div className="min-w-[40%] lg:min-w-[400px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden">
                    <div className="flex flex-col gap-5">
                        <h1 className="font-medium text-xl">Stories from all interests</h1>
                        <div className="flex gap-3 flex-wrap">
                            {
                                categories.map((category, index) => (
                                    <button
                                        className={"tag " + (pageState === category ? " bg-black text-white" : "")}
                                        onClick={loadBlogCategory}
                                        key={index}
                                    >
                                        {category.charAt(0).toUpperCase() + category.slice(1)}  {/* Capitalize first letter */}
                                    </button>
                                ))
                            }
                        </div>
                        <div className="flex flex-col gap-3">
                            <h1 className="font-medium text-xl">Trending <i className="fi fi-rr-arrow-trend-up"></i></h1>
                            <TrendingBlogs blogs={trendingBlog} />
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default HomePage;
