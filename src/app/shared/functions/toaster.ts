import Swal from "sweetalert2";
import { MsgDefault } from "../enums/msg-default.enum";

export class Toaster {
  static msg = MsgDefault;

  private static Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
  });

  static Success(msg: string): void {
    this.Toast.fire({
      icon: 'success',
      title: msg,
    });
  }

  static Error(msg: string): void {
    this.Toast.fire({
      icon: 'error',
      title: msg,
    });
  }

  static Warning(msg: string): void {
    this.Toast.fire({
      icon: 'warning',
      title: msg,
    });
  }

  static Info(msg: string): void {
    this.Toast.fire({
      icon: 'info',
      title: msg,
    });
  }
}
