import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const loanApi = createApi({
    reducerPath: 'loan',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.REACT_APP_API_SERVER_URL
    }),
    endpoints(builder) {
        return {
            fetchAmortization: builder.query({
                providesTags:['Amortization'], //Add in the store file for mutation endpoint-> invalidateTags:['Amortization']
                query:(loan) => {
                    return {
                        url: '/api/add',
                        params: {
                            lamount: loan.lamount,
                            lrate: loan.lrate,
                            lterm: loan.lterm,
                            lStartDate: loan.startDate,
                            recurMAmt: loan.recurMAmt,
                            recurMDate: loan.recurMDate,
                            recurAAmt: loan.recurAAmt,
                            recurADate: loan.recurADate,
                            onePayAmt: loan.onePayAmt,
                            onePayDate: loan.onePayDate,
                        },
                        method:'GET'
                    };
                }
            }),
            saveAnalysis: builder.mutation({
                query: (data)=> {
                    return {
                        url:'/api/save',
                        method:'POST',
                        body: {
                            data:data.data,
                            uname:data.uname,
                            email:data.email,
                            dataType:data.dataType,
                        }
                    }
                }
            })
        }
    }
});

export const {useFetchAmortizationQuery, useSaveAnalysisMutation} = loanApi;
export {loanApi};