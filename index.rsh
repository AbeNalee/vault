'reach 0.1';

const COUNTDOWN = 10;

const Shared = {
  showTime: Fun([UInt], Null),
}
export const main = Reach.App(() => {
  const A = Participant('Alice', {
    ...Shared,
    inheritance: UInt,
    isHere: Fun([], Bool),
  });
  const B = Participant('Bob', {
    ...Shared,
    acceptTerms: Fun([UInt],Bool),
  });
  init();
  A.only(() => {
    const value = declassify(interact.inheritance);
  })
  A.publish(value)
    .pay(value);
  commit();
  B.only(() => {
    const terms = declassify(interact.acceptTerms(value));
  })
  B.publish(terms);
  commit();
  each([A,B], () => {
    interact.showTime(COUNTDOWN);
  });
  A.only(() => {
    const stillHere = declassify(interact.isHere());
  })
  A.publish(stillHere);
  if(stillHere) {
    transfer(value).to(A);
  } else {
    transfer(value).to(B)
  }
  commit();
  exit();
});
