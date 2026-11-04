import {Navigate,useParams} from 'react-router-dom';
import {getCityBySlug} from '@/data/cities';
import {getCategoryBySlug} from '@/data/categories';
import NotFound from '@/pages/NotFound';
/** Keep old discovery links useful without reviving unsubstantiated statewide copy. */
export default function LegacyDirectoryRoute(){
 const {city,category,location}=useParams();
 const place=city??location;
 if(category&&!getCategoryBySlug(category))return <NotFound/>;
 if(place&&place!=='kerala'&&!getCityBySlug(place))return <NotFound/>;
 const query=new URLSearchParams();
 if(place&&place!=='kerala')query.set('city',place);
 if(category)query.set('category',category);
 return <Navigate to={`/directory${query.size?'?'+query.toString():''}`} replace/>;
}
