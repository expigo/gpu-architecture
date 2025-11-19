"""
Data Parallelism Demonstration
Module 1: Introduction to GPU Computing

This script demonstrates how GPUs excel at data-parallel operations by
comparing element-wise operations on CPU vs GPU.
"""

import torch
import time
import numpy as np


def demo_element_wise_operations(n=10_000_000):
    """
    Demonstrate GPU advantage for element-wise operations.

    These operations are perfectly data-parallel - the same operation
    is applied to every element independently.
    """
    print("="*70)
    print(f"Element-wise Operations on {n:,} Elements")
    print("="*70)

    # Create data on CPU
    x_cpu = torch.randn(n)
    y_cpu = torch.randn(n)

    # CPU computation
    print("\n[CPU] Running element-wise operations...")
    start = time.time()
    z_cpu = torch.relu(x_cpu * y_cpu + 0.5)
    cpu_time = time.time() - start

    print(f"  Time: {cpu_time*1000:.2f} ms")
    print(f"  Throughput: {n/cpu_time/1e6:.2f} million elements/sec")

    if torch.cuda.is_available():
        # Move data to GPU
        x_gpu = x_cpu.cuda()
        y_gpu = y_cpu.cuda()

        # Warmup
        z_gpu = torch.relu(x_gpu * y_gpu + 0.5)
        torch.cuda.synchronize()

        # GPU computation
        print("\n[GPU] Running element-wise operations...")
        start = time.time()
        z_gpu = torch.relu(x_gpu * y_gpu + 0.5)
        torch.cuda.synchronize()
        gpu_time = time.time() - start

        print(f"  Time: {gpu_time*1000:.2f} ms")
        print(f"  Throughput: {n/gpu_time/1e6:.2f} million elements/sec")

        speedup = cpu_time / gpu_time
        print(f"\n  Speedup: {speedup:.2f}x")
        print(f"  Efficiency: Processing {speedup:.1f}x more data in the same time!")

        # Verify correctness
        max_diff = torch.max(torch.abs(z_cpu - z_gpu.cpu())).item()
        print(f"\n  Max difference: {max_diff:.2e}")
        print("  ✓ Results match!" if max_diff < 1e-5 else "  ⚠ Results differ")
    else:
        print("\n⚠ GPU not available for comparison")


def demo_batch_processing():
    """
    Demonstrate batch processing - a key ML/DL pattern.

    In deep learning, we process multiple samples in parallel.
    This is ideal for GPUs!
    """
    print("\n\n" + "="*70)
    print("Batch Processing: Simulating Neural Network Layer")
    print("="*70)

    batch_sizes = [1, 32, 64, 128, 256]
    input_size = 1024
    output_size = 512

    print(f"\nLayer dimensions: {input_size} → {output_size}")
    print(f"\nBatch Size | CPU Time | GPU Time | Speedup")
    print("-" * 50)

    for batch_size in batch_sizes:
        # Create random input and weights
        x_cpu = torch.randn(batch_size, input_size)
        w_cpu = torch.randn(input_size, output_size)
        b_cpu = torch.randn(output_size)

        # CPU forward pass
        start = time.time()
        for _ in range(10):
            y_cpu = torch.matmul(x_cpu, w_cpu) + b_cpu
            y_cpu = torch.relu(y_cpu)
        cpu_time = (time.time() - start) / 10

        if torch.cuda.is_available():
            # GPU forward pass
            x_gpu = x_cpu.cuda()
            w_gpu = w_cpu.cuda()
            b_gpu = b_cpu.cuda()

            # Warmup
            y_gpu = torch.relu(torch.matmul(x_gpu, w_gpu) + b_gpu)
            torch.cuda.synchronize()

            start = time.time()
            for _ in range(10):
                y_gpu = torch.matmul(x_gpu, w_gpu) + b_gpu
                y_gpu = torch.relu(y_gpu)
            torch.cuda.synchronize()
            gpu_time = (time.time() - start) / 10

            speedup = cpu_time / gpu_time
            print(f"{batch_size:10} | {cpu_time*1000:7.2f} ms | {gpu_time*1000:7.2f} ms | {speedup:6.2f}x")
        else:
            print(f"{batch_size:10} | {cpu_time*1000:7.2f} ms |    N/A   |   N/A")

    if torch.cuda.is_available():
        print("\n💡 Key Insight: Larger batches = Better GPU utilization!")
        print("   GPUs shine when processing many samples in parallel.")


def demo_parallel_reduction():
    """
    Demonstrate parallel reduction operations.

    Operations like sum, mean, max benefit from parallel tree reduction.
    """
    print("\n\n" + "="*70)
    print("Parallel Reduction Operations")
    print("="*70)

    size = 100_000_000
    print(f"\nComputing statistics on {size:,} elements")

    # Create data
    data_cpu = torch.randn(size)

    # CPU reductions
    print("\n[CPU]")
    ops = ['sum', 'mean', 'std', 'max', 'min']
    cpu_times = {}

    for op in ops:
        start = time.time()
        result = getattr(torch, op)(data_cpu)
        cpu_times[op] = time.time() - start
        print(f"  {op:5}: {cpu_times[op]*1000:6.2f} ms")

    if torch.cuda.is_available():
        data_gpu = data_cpu.cuda()

        # Warmup
        _ = torch.sum(data_gpu)
        torch.cuda.synchronize()

        # GPU reductions
        print("\n[GPU]")
        gpu_times = {}

        for op in ops:
            start = time.time()
            result = getattr(torch, op)(data_gpu)
            torch.cuda.synchronize()
            gpu_times[op] = time.time() - start
            speedup = cpu_times[op] / gpu_times[op]
            print(f"  {op:5}: {gpu_times[op]*1000:6.2f} ms (speedup: {speedup:5.2f}x)")


def demo_memory_transfer_overhead():
    """
    Demonstrate the cost of CPU-GPU memory transfers.

    Important lesson: Keep data on GPU when possible!
    """
    print("\n\n" + "="*70)
    print("Memory Transfer Overhead")
    print("="*70)

    if not torch.cuda.is_available():
        print("\n⚠ GPU not available")
        return

    sizes_mb = [1, 10, 100, 1000]

    print("\nData Size | CPU→GPU | GPU→CPU | Total")
    print("-" * 50)

    for size_mb in sizes_mb:
        num_elements = (size_mb * 1024 * 1024) // 4  # 4 bytes per float32

        # Create data on CPU
        data_cpu = torch.randn(num_elements)

        # CPU to GPU
        start = time.time()
        data_gpu = data_cpu.cuda()
        torch.cuda.synchronize()
        cpu_to_gpu = time.time() - start

        # GPU to CPU
        start = time.time()
        data_back = data_gpu.cpu()
        gpu_to_cpu = time.time() - start

        total = cpu_to_gpu + gpu_to_cpu
        bandwidth = (size_mb * 2) / total  # Total MB transferred / time

        print(f"{size_mb:6} MB | {cpu_to_gpu*1000:6.2f} ms | {gpu_to_cpu*1000:6.2f} ms | {total*1000:6.2f} ms ({bandwidth:.0f} MB/s)")

    print("\n💡 Key Insight: Memory transfers have overhead!")
    print("   • Keep data on GPU across multiple operations")
    print("   • Transfer large batches, not individual items")
    print("   • Minimize CPU-GPU communication")


def main():
    """Run all demonstrations."""

    print("\n" + "="*70)
    print("GPU Architecture Course - Data Parallelism Demonstration")
    print("="*70)

    if torch.cuda.is_available():
        print(f"\n✓ GPU: {torch.cuda.get_device_name(0)}")
        print(f"  Memory: {torch.cuda.get_device_properties(0).total_memory / 1e9:.2f} GB")
    else:
        print("\n⚠ No GPU detected - running CPU-only demonstrations")

    # Run demonstrations
    demo_element_wise_operations()
    demo_batch_processing()
    demo_parallel_reduction()
    demo_memory_transfer_overhead()

    # Summary
    print("\n\n" + "="*70)
    print("Summary: When Do GPUs Shine?")
    print("="*70)
    print("\n✓ Data parallelism: Same operation on many elements")
    print("✓ Large batch sizes: Process multiple samples together")
    print("✓ Matrix operations: Core of neural networks")
    print("✓ Reduction operations: Efficient parallel algorithms")
    print("\n⚠ Watch out for:")
    print("  • Memory transfer overhead - keep data on GPU")
    print("  • Small computations - overhead may outweigh benefits")
    print("  • Sequential dependencies - limits parallelization")

    print("\n" + "="*70 + "\n")


if __name__ == "__main__":
    main()
