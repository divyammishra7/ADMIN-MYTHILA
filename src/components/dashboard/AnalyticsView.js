import React, { useEffect, useMemo, useState } from 'react';
import { Box, Heading, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText, Slider, SliderTrack, SliderFilledTrack, SliderThumb, Flex, Text, Select } from '@chakra-ui/react';
import { useSupabase } from '../../context/SupabaseContext';

function groupBy(xs, key) {
  return xs.reduce((acc, x) => {
    const k = typeof key === 'function' ? key(x) : x[key];
    acc[k] = acc[k] || [];
    acc[k].push(x);
    return acc;
  }, {});
}

function AnalyticsView() {
  const [monthOffset, setMonthOffset] = useState(0); // 0 = current month, 1 = last month, etc.
  const [rangeMonths, setRangeMonths] = useState(2); // show last 3 months by default
  const { fetchOrders, fetchOrderLinesForOrderIds } = useSupabase();
  const [orders, setOrders] = useState([]);
  const [orderLines, setOrderLines] = useState([]);

  useEffect(() => {
    const load = async () => {
      const data = await fetchOrders();
      const ordersWithDates = (data || []).map((o) => ({ ...o, order_date: new Date(o.order_date) }));
      setOrders(ordersWithDates);
      const ids = ordersWithDates.map((o) => o.order_id);
      const lines = await fetchOrderLinesForOrderIds(ids);
      setOrderLines(lines || []);
    };
    load();
  }, [fetchOrders, fetchOrderLinesForOrderIds]);

  const filteredOrders = useMemo(() => {
    const now = new Date();
    const end = new Date(now.getFullYear(), now.getMonth() - monthOffset + 1, 0, 23, 59, 59, 999);
    const start = new Date(end.getFullYear(), end.getMonth() - rangeMonths, 1, 0, 0, 0, 0);
    return orders.filter((o) => o.order_date >= start && o.order_date <= end);
  }, [orders, monthOffset, rangeMonths]);

  const totalRevenue = useMemo(() => filteredOrders.reduce((a, b) => a + Number(b.total_amount || 0), 0), [filteredOrders]);

  const averageOrderPrice = useMemo(() => filteredOrders.length ? totalRevenue / filteredOrders.length : 0, [filteredOrders, totalRevenue]);

  const orderIds = useMemo(() => new Set(filteredOrders.map((o) => o.order_id)), [filteredOrders]);

  const productQuantities = useMemo(() => {
    const lines = (orderLines || []).filter((l) => orderIds.has(l.order_id));
    const counts = {};
    lines.forEach((l) => {
      const productId = l.product?.id || l.product_id;
      counts[productId] = (counts[productId] || 0) + (l.quantity || 0);
    });
    const arr = Object.entries(counts).map(([productId, qty]) => {
      const p = (orderLines || []).find((l) => (l.product?.id || l.product_id) === productId)?.product;
      return { productId, name: p?.name || productId, qty };
    });
    return arr.sort((a, b) => b.qty - a.qty).slice(0, 8);
  }, [orderIds, orderLines]);

  const revenueByMonth = useMemo(() => {
    const byMonth = {};
    filteredOrders.forEach((o) => {
      const k = `${o.order_date.getFullYear()}-${o.order_date.getMonth() + 1}`;
      byMonth[k] = (byMonth[k] || 0) + Number(o.total_amount || 0);
    });
    return Object.entries(byMonth)
      .map(([k, v]) => ({ label: k, value: v }))
      .sort((a, b) => (a.label > b.label ? 1 : -1));
  }, [filteredOrders]);

  return (
    <Box>
      <Flex align='center' gap={6} mb={6} wrap='wrap'>
        <Box minW='240px'>
          <Text fontWeight='semibold'>Month window</Text>
          <Slider value={rangeMonths} onChange={setRangeMonths} min={0} max={11} step={1}>
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
          <Text fontSize='sm' color='gray.500'>Showing last {rangeMonths + 1} months</Text>
        </Box>
        <Box minW='220px'>
          <Text fontWeight='semibold'>Shift window</Text>
          <Slider value={monthOffset} onChange={setMonthOffset} min={0} max={24} step={1}>
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
          <Text fontSize='sm' color='gray.500'>Offset: {monthOffset} months</Text>
        </Box>
      </Flex>

      <SimpleGrid columns={[1, 2, 4]} spacing={6} mb={8}>
        <Stat>
          <StatLabel>Total revenue</StatLabel>
          <StatNumber>${totalRevenue.toFixed(2)}</StatNumber>
          <StatHelpText>In selected window</StatHelpText>
        </Stat>
        <Stat>
          <StatLabel>Average order price</StatLabel>
          <StatNumber>${averageOrderPrice.toFixed(2)}</StatNumber>
          <StatHelpText>Across {filteredOrders.length} orders</StatHelpText>
        </Stat>
        <Stat>
          <StatLabel>Orders</StatLabel>
          <StatNumber>{filteredOrders.length}</StatNumber>
          <StatHelpText>Placed</StatHelpText>
        </Stat>
        <Stat>
          <StatLabel>Top product</StatLabel>
          <StatNumber>{productQuantities[0]?.name || '-'}</StatNumber>
          <StatHelpText>by quantity</StatHelpText>
        </Stat>
      </SimpleGrid>

      <Box mb={6}>
        <Heading size='sm' mb={3}>Top products by quantity</Heading>
        <Box border='1px solid #eee' borderRadius='8px' p={3}>
          {productQuantities.map((p) => (
            <Flex key={p.productId} justify='space-between' py={1}>
              <Text>{p.name}</Text>
              <Text fontWeight='semibold'>{p.qty}</Text>
            </Flex>
          ))}
          {!productQuantities.length && <Text color='gray.500'>No data</Text>}
        </Box>
      </Box>

      <Box>
        <Heading size='sm' mb={3}>Revenue by month</Heading>
        <Box border='1px solid #eee' borderRadius='8px' p={3}>
          {revenueByMonth.map((r) => (
            <Flex key={r.label} justify='space-between' py={1}>
              <Text>{r.label}</Text>
              <Text fontWeight='semibold'>${r.value.toFixed(2)}</Text>
            </Flex>
          ))}
          {!revenueByMonth.length && <Text color='gray.500'>No data</Text>}
        </Box>
      </Box>
    </Box>
  );
}

export default AnalyticsView;


