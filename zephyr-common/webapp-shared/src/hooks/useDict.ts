import { useState, useCallback, useEffect } from 'react';
import { request } from '../utils/request';

/** 字典数据项 */
interface DictItem {
  label: string;
  value: string | number;
  cssClass?: string;
  listClass?: string;
  isDefault?: string;
  status?: string;
}

/** 字典缓存 */
const dictCache: Record<string, DictItem[]> = {};

/** 字典数据 Hook */
export function useDict(dictType: string) {
  const [options, setOptions] = useState<DictItem[]>(dictCache[dictType] || []);
  const [loading, setLoading] = useState(false);

  const fetchDict = useCallback(async () => {
    if (dictCache[dictType]) {
      setOptions(dictCache[dictType]);
      return;
    }
    setLoading(true);
    try {
      const res = await request.get<DictItem[]>(`/dict/data/type/${dictType}`);
      const data = res.data || [];
      dictCache[dictType] = data;
      setOptions(data);
    } catch {
      // 使用默认 mock 数据
      setOptions([]);
    } finally {
      setLoading(false);
    }
  }, [dictType]);

  useEffect(() => {
    fetchDict();
  }, [fetchDict]);

  /** 根据字典值获取标签 */
  const getLabel = useCallback(
    (value: string | number): string => {
      const item = options.find((o) => o.value === value);
      return item?.label || String(value);
    },
    [options]
  );

  /** 根据字典值获取样式类 */
  const getCssClass = useCallback(
    (value: string | number): string => {
      const item = options.find((o) => o.value === value);
      return item?.cssClass || '';
    },
    [options]
  );

  return {
    options,
    loading,
    getLabel,
    getCssClass,
    refresh: fetchDict,
  };
}

/** 清除字典缓存 */
export function clearDictCache(dictType?: string) {
  if (dictType) {
    delete dictCache[dictType];
  } else {
    Object.keys(dictCache).forEach((key) => delete dictCache[key]);
  }
}
