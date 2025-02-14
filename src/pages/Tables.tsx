import { Outlet } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';

import TableThree from '../components/Tables/TableThree';


const Tables = () => {
  return (
    <>
      <Breadcrumb pageName="Pacientes" number={10}/>

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
