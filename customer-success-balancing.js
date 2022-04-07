/**
 * Returns the id of the CustomerSuccess with the most customers
 * @param {array} customerSuccess
 * @param {array} customers
 * @param {array} customerSuccessAway
 */
function customerSuccessBalancing(
  customerSuccess,
  customers,
  customerSuccessAway
) {
  const customerSuccesses = customerSuccess
    .filter(item => !customerSuccessAway.includes(item.id))
    .sort((a, b) => a.score - b.score)

  const customerSorted = customers.sort((a, b) => a.score - b.score)

  const cssWithCustomers = customerSuccesses.map((item, index) => {
    const customers = customerSorted.reduce((acc, customer) => {
      if (
        customer.score <= item.score &&
        (index != 0
          ? customer.score > customerSuccesses[index - 1].score
          : true)
      ) {
        acc += 1
      }
      return acc
    }, 0)
    return {
      ...item,
      customers
    }
  })

  const cssWithCustomersSorted = cssWithCustomers.sort(
    (a, b) => b.customers - a.customers
  )

  if (cssWithCustomersSorted.length <= 1) {
    return cssWithCustomersSorted[0].id
  }

  if (
    cssWithCustomersSorted[0].customers ===
      cssWithCustomersSorted[1].customers &&
    cssWithCustomersSorted.length > 1
  ) {
    return 0
  }

  return cssWithCustomersSorted[0].id
}

test('Scenario 1', () => {
  const css = [
    { id: 1, score: 60 },
    { id: 2, score: 20 },
    { id: 3, score: 95 },
    { id: 4, score: 75 }
  ]
  const customers = [
    { id: 1, score: 90 },
    { id: 2, score: 20 },
    { id: 3, score: 70 },
    { id: 4, score: 40 },
    { id: 5, score: 60 },
    { id: 6, score: 10 }
  ]
  const csAway = [2, 4]

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(1)
})

function buildSizeEntities(size, score) {
  const result = []
  for (let i = 0; i < size; i += 1) {
    result.push({ id: i + 1, score })
  }
  return result
}

function mapEntities(arr) {
  return arr.map((item, index) => ({
    id: index + 1,
    score: item
  }))
}

function arraySeq(count, startAt) {
  return Array.apply(0, Array(count)).map((it, index) => index + startAt)
}

test('Scenario 2', () => {
  const css = mapEntities([11, 21, 31, 3, 4, 5])
  const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60])
  const csAway = []

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(0)
})

test('Scenario 3', () => {
  const testTimeoutInMs = 1000
  const testStartTime = new Date().getTime()

  const css = mapEntities(arraySeq(999, 1))
  const customers = buildSizeEntities(10000, 998)
  const csAway = [999]

  // OBSERVACAO: O teste está diferente do esperado, pois espera como resultado o CSS de id 999, que está em abstenção.
  // O resultado esperado do mesmo senário em Ruby é 998, por este motivo tomei a liberdade de mudá-lo.
  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(998)

  if (new Date().getTime() - testStartTime > testTimeoutInMs) {
    throw new Error(`Test took longer than ${testTimeoutInMs}ms!`)
  }
})

test('Scenario 4', () => {
  const css = mapEntities([1, 2, 3, 4, 5, 6])
  const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60])
  const csAway = []

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(0)
})

test('Scenario 5', () => {
  const css = mapEntities([100, 2, 3, 3, 4, 5])
  const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60])
  const csAway = []

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(1)
})

test('Scenario 6', () => {
  const css = mapEntities([100, 99, 88, 3, 4, 5])
  const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60])
  const csAway = [1, 3, 2]

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(0)
})

test('Scenario 7', () => {
  const css = mapEntities([100, 99, 88, 3, 4, 5])
  const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60])
  const csAway = [4, 5, 6]

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(3)
})
