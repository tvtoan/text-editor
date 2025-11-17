'use client';
import { Pagination as AntPagination } from 'antd';

interface PaginationProps {
  page: number;
  setPage: (p: number) => void;
  total: number;
  perPage?: number;
}

export default function Pagination({ page, setPage, total, perPage = 5 }: PaginationProps) {
  return (
    <div className="flex justify-center mt-6">
      <AntPagination
        current={page}
        total={total}
        pageSize={perPage}
        onChange={setPage}
        showSizeChanger={false}
        showQuickJumper={false}
      />
    </div>
  );
}
