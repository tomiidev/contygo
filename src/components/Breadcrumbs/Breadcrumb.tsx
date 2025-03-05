import { Link } from 'react-router-dom';
interface BreadcrumbProps {
  pageName: string;
  number: number;
}
const Breadcrumb = ({ pageName, number }: BreadcrumbProps) => {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className='flex items-center gap-2'>

        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          {pageName}
        </h2>
        <span className='text-xl'><strong>{number === 0 ? "" : `(${number})`}</strong></span>
      </div>
      <nav>
        <ol className="flex items-center gap-2">
          <li>
            <Link className="font-medium" to="/">
              Dashboard /
            </Link>
          </li>
          <li className="font-medium text-primary">{pageName}</li>

        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
