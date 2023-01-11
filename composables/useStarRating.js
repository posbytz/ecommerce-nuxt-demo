const useStarRating = () => {
    const productStarRating = useState("starRating", ()=> 0 )

    const changeStarRating = (star)=>{
        productStarRating.value = star;
       
      }

    return {
        productStarRating, changeStarRating,
    };
};

export default useStarRating;