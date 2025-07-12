import Input from '@/components/Input';
import { useState } from 'react';

import { useFarmContext } from '../context';

const Search = () => {
  const { onSearch } = useFarmContext();

  const [search, setSearch] = useState('');
  const [searchTimer, setSearchTimer] = useState<number>();

  const onUpdateSearch = (value: string) => {
    setSearch(value);

    if (searchTimer) {
      clearTimeout(searchTimer);
    }

    const timer = setTimeout(() => {
      onSearch(value);
    }, 1000);

    setSearchTimer(timer);
  };

  return (
    <Input
      iconName="search"
      placeholder="Buscar fazenda"
      width="50%"
      withoutMargin
      value={search}
      onChangeText={onUpdateSearch}
      inline
    />
  );
};

export default Search;
