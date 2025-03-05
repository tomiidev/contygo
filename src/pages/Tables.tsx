import { Outlet } from 'react-router-dom';
import TableThree from '../components/Tables/TableThree';


const Tables = () => {

  return (
    <>
     

      <div className="flex flex-col gap-10">
       {/*  <TableOne /> */}
       {/*  <TableTwo /> */}
        <TableThree />
      </div>
   <Outlet/>
    </>
  );
};

export default Tables;
