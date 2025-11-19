"""
GPU Availability Check
Module 1: Introduction to GPU Computing

This script checks for GPU availability using both PyTorch and TensorFlow,
and displays detailed GPU information.
"""

import sys

def check_pytorch_gpu():
    """Check PyTorch GPU availability and properties."""
    try:
        import torch

        print("="*60)
        print("PyTorch GPU Information")
        print("="*60)

        print(f"CUDA Available: {torch.cuda.is_available()}")

        if torch.cuda.is_available():
            print(f"CUDA Version: {torch.version.cuda}")
            print(f"Number of GPUs: {torch.cuda.device_count()}")
            print()

            for i in range(torch.cuda.device_count()):
                print(f"GPU {i}: {torch.cuda.get_device_name(i)}")
                props = torch.cuda.get_device_properties(i)
                print(f"  Total Memory: {props.total_memory / 1e9:.2f} GB")
                print(f"  Multiprocessors: {props.multi_processor_count}")
                print(f"  CUDA Capability: {props.major}.{props.minor}")
                print(f"  Max Threads per Block: {props.max_threads_per_block}")
                print(f"  Max Threads per Multiprocessor: {props.max_threads_per_multi_processor}")
                print()
        else:
            print("No CUDA GPUs available. PyTorch will use CPU.")

        return torch.cuda.is_available()

    except ImportError:
        print("PyTorch not installed. Install with: pip install torch")
        return False


def check_tensorflow_gpu():
    """Check TensorFlow GPU availability."""
    try:
        import tensorflow as tf

        print("="*60)
        print("TensorFlow GPU Information")
        print("="*60)

        gpus = tf.config.list_physical_devices('GPU')
        print(f"Number of GPUs available: {len(gpus)}")

        for i, gpu in enumerate(gpus):
            print(f"\nGPU {i}: {gpu.name}")
            print(f"  Device Type: {gpu.device_type}")

            # Try to get GPU details
            try:
                gpu_details = tf.config.experimental.get_device_details(gpu)
                for key, value in gpu_details.items():
                    print(f"  {key}: {value}")
            except:
                pass

        if len(gpus) == 0:
            print("\nNo GPUs available. TensorFlow will use CPU.")
        else:
            print(f"\nTensorFlow version: {tf.__version__}")
            print(f"Built with CUDA: {tf.test.is_built_with_cuda()}")

        return len(gpus) > 0

    except ImportError:
        print("TensorFlow not installed. Install with: pip install tensorflow")
        return False


def benchmark_simple_operation():
    """Simple benchmark to demonstrate GPU speedup."""
    try:
        import torch
        import time

        if not torch.cuda.is_available():
            print("\nSkipping benchmark - no GPU available")
            return

        print("="*60)
        print("Simple Performance Comparison")
        print("="*60)

        size = 5000
        print(f"\nCreating {size}x{size} random matrices...")

        # CPU
        a_cpu = torch.randn(size, size)
        b_cpu = torch.randn(size, size)

        start = time.time()
        c_cpu = torch.matmul(a_cpu, b_cpu)
        cpu_time = time.time() - start

        # GPU
        a_gpu = a_cpu.cuda()
        b_gpu = b_cpu.cuda()

        # Warmup
        c_gpu = torch.matmul(a_gpu, b_gpu)
        torch.cuda.synchronize()

        # Benchmark
        start = time.time()
        c_gpu = torch.matmul(a_gpu, b_gpu)
        torch.cuda.synchronize()
        gpu_time = time.time() - start

        print(f"\nMatrix Multiplication ({size}x{size}):")
        print(f"  CPU Time: {cpu_time*1000:.2f} ms")
        print(f"  GPU Time: {gpu_time*1000:.2f} ms")
        print(f"  Speedup: {cpu_time/gpu_time:.2f}x")

        # Verify results match
        max_diff = torch.max(torch.abs(c_cpu - c_gpu.cpu())).item()
        print(f"\nMax difference between CPU and GPU results: {max_diff:.2e}")
        print("✓ Results match!" if max_diff < 1e-4 else "⚠ Results differ!")

    except ImportError:
        print("\nPyTorch not installed for benchmark")
    except Exception as e:
        print(f"\nBenchmark failed: {e}")


def main():
    """Main function to run all GPU checks."""
    print("\n" + "="*60)
    print("GPU Architecture Course - GPU Detection Script")
    print("="*60 + "\n")

    pytorch_available = check_pytorch_gpu()
    print()
    tensorflow_available = check_tensorflow_gpu()

    if pytorch_available or tensorflow_available:
        print("\n✓ GPU detected and ready for deep learning!")
        benchmark_simple_operation()
    else:
        print("\n⚠ No GPU detected. You can still run the code on CPU,")
        print("  but performance will be significantly slower.")
        print("\nTo use a GPU:")
        print("  1. Ensure you have an NVIDIA GPU")
        print("  2. Install CUDA Toolkit: https://developer.nvidia.com/cuda-downloads")
        print("  3. Install GPU-enabled PyTorch/TensorFlow")

    print("\n" + "="*60 + "\n")


if __name__ == "__main__":
    main()
