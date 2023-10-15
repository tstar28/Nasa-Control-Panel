const Default_Page_Number=1;
const Default_Limit_Number=0;

function pagination(query){
    const page = Math.abs(query.page) || Default_Page_Number;
    const limit = Math.abs(query.limit) || Default_Limit_Number;
    const skip = (page-1)*limit;
    return {
        skip,
        limit,
    };
}

module.exports ={ 
    pagination,
};