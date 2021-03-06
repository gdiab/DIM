import { IComponentOptions, IController, IIntervalService } from 'angular';

export const CountdownComponent: IComponentOptions = {
  bindings: {
    endTime: '<'
  },
  controller: CountdownController,
  template: '<span class="countdown">{{$ctrl.text}}</span>'
};

/**
 * A really simple countdown timer.
 */
function CountdownController(this: IController, $interval: IIntervalService, $i18next) {
  'ngInject';

  const vm = this;

  vm.$onInit = () => {
    vm.endTime = new Date(vm.endTime);

    // Update once a minute
    vm.timer = $interval(update, 60000);
    update();
  };

  vm.$onDestroy = () => {
    $interval.cancel(vm.timer);
  };

  function update() {
    const diff = vm.endTime.getTime() - Date.now();
    vm.text = dhms(diff / 1000);
    if (diff <= 0) {
      $interval.cancel(vm.timer);
    }
  }

  function pad(n, width) {
    n = String(n);
    return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
  }

  function dhms(secs) {
    secs = Math.max(0, secs);

    const days = Math.floor(secs / 86400);
    secs -= days * 86400;
    const hours = Math.floor(secs / 3600) % 24;
    secs -= hours * 3600;
    const minutes = Math.floor(secs / 60) % 60;

    let text = `${hours}:${pad(minutes, 2)}`;
    if (days > 0) {
      text = `${$i18next.t('Countdown.Days', { count: days })} ${text}`;
    }
    return text;
  }
}
